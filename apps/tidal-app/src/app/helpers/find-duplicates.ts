import { IPlaylist } from '@tidal-gui/api';
export const getDuplicateMapList = (list) => {
  const duplicateMapList = list.reduce((acc, cur, idx, arr) => {
    const { title, numberOfTracks: count, uuid, description } = cur;
    if (
      description.indexOf(
        'Playlist Created with https://www.tunemymusic.com?source=plcreateds that lets you transfer your playlist to Tidal from any music platform such as YouTube, Spotify, Apple music and more!'
      ) !== -1
    ) {
      const playlistsForCurrentTitle = [...(acc[title] ?? []), cur].sort(
        (a, b) => b.numberOfTracks - a.numberOfTracks
      );
      return { ...acc, [title]: playlistsForCurrentTitle };
    }
    return acc;
  }, {});
  return duplicateMapList;
};

export const handleDuplicatePlaylists = async (playlists: IPlaylist[], API) => {
  Object.entries(getDuplicateMapList(playlists)).forEach(
    async ([title, titlePlaylists]: [string, IPlaylist[]], idx, arr) => {
      console.log(
        idx,
        'handleDuplicatePlaylists with title:',
        title,
        'count',
        titlePlaylists.length
      );

      const [err, success] = await mergeDuplicatePlaylists(titlePlaylists, API);
      if (!err && success) {
        console.log(titlePlaylists.length, 'dups can be deleted for', title);
      } else {
        console.error(title, err);
      }
    }
  );
};

export const mergeDuplicatePlaylists = async (playlists: IPlaylist[], API) => {
  if (!playlists || playlists.length < 2)
    return [`Only ${playlists.length} !!!`, null];
  let canDelete = true;
  let retError = null;
  const [longestPlaylist, ...restPlaylists] = playlists;

  restPlaylists.forEach(async ({ uuid, title }, idx) => {
    const [err, items] = await API.getPlaylistTracks(uuid);

    if (!err && items) {
      const trackIds = items.map(({ id }) => id);
      // await API.deletePlaylist(uuid);

      const [err, success] = await API.addTracksToPlaylistAsync(
        trackIds,
        longestPlaylist.uuid
      );

      if (err) {
        console.error(
          'playlist',
          idx,
          'for',
          title,
          'failed to merge into',
          longestPlaylist.uuid,
          err
        );

        retError = err;

        canDelete = false;
      }
      if (success) {
        console.log(
          'playlist no.',
          idx,
          'with',
          uuid,
          'for',
          title,
          'was merged successfully !!! into',
          longestPlaylist.uuid
        );

        const [err, res] = await API.deletePlaylist(uuid);

        console.log(
          'Hence, playlist',
          idx,
          ':',
          uuid,
          'for',
          title,
          longestPlaylist.uuid,
          `was ${err ? 'not' : res ? 'indeed' : ''} deleted !!!`
        );
      }
    }
  });

  return [retError, canDelete];
};

export const getMarkedDuplicateList = (list) => {
  const buffer = {};
  // const list = JSON.parse(JSON.stringify(arr)) as Array<object>;
  // list.sort((a, b) => {
  //   const aa = a.title.toLowerCase();
  //   const bb = b.title.toLowerCase();
  //   return aa > bb ? 1 : aa < bb ? -1 : 0;
  // });
  const keyGenerator = (item) => {
    // const devID = `${item.title.trim()} (${item.numberOfTracks})`;
    const devID = [item.title.trim(), item.numberOfTracks];
    return { ...item, devID };
  };

  const markedList = list.map(keyGenerator).reduce((acc, cur, idx, arr) => {
    const [title, count] = cur.devID;
    const alreadyExists = buffer[title] ? count : `FIRST (${count})`;
    buffer[title] = true;

    return [...acc, { ...cur, isDuplicate: alreadyExists }];
  }, []);
  return markedList;
};

export const getDuplicatesOnly = (list, marked = false) => {
  const markedList = marked ? { ...list } : getMarkedDuplicateList(list);

  return markedList.filter(
    ({ isDuplicate, description }) =>
      Boolean(isDuplicate) &&
      description.indexOf(
        'Playlist Created with https://www.tunemymusic.com?source=plcreateds that lets you transfer your playlist to Tidal from any music platform such as YouTube, Spotify, Apple music and more!'
      ) !== -1
  );
};

export const getFilteredPlaylistSpotify = (playlists: IPlaylist[]) => {
  return [
    ...getFilteredPlaylist(playlists, [
      ({ description }) =>
        description.indexOf(
          'Playlist Created with https://www.tunemymusic.com?source=plcreateds that lets you transfer your playlist to Tidal from any music platform such as YouTube, Spotify, Apple music and more!'
        ) !== -1,
    ]),
  ];
};

export const getFilteredPlaylist = (playlists: IPlaylist[], predicates) => [
  ...playlists.filter((val, idx, arr) => dataFilter(val, predicates)),
];

type IFilter = <T>(data: T, predicates: Array<(T) => boolean>) => boolean;
const dataFilter: IFilter = (item, predicates) =>
  predicates.every((predicate) => predicate(item));
