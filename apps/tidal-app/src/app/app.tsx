import React, { useState, useEffect } from 'react';

import styles from './app.module.scss';
import { username, password } from '../../../../creds.json';

import { ReactComponent as Logo } from './logo.svg';
import { TidalAPI } from '@tidal-gui/api';
import {
  getDuplicateMapList,
  getDuplicatesOnly,
  getFilteredPlaylistSpotify,
  handleDuplicatePlaylists,
} from './helpers/find-duplicates';
import { IPlaylist } from '@tidal-gui/api';
import { DataGrid } from '@material-ui/data-grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export function App() {
  const [API, setAPI] = useState(
    new TidalAPI({
      username,
      password,
      token: '_KM2HixcUBZtmktH',
      clientVersion: '2.2.1--7',
      quality: 'LOSSLESS',
    })
  );

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  const [artists, setArtists] = useState([{ name: 'wait...' }]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const foo = async () => {
      const [err, data] = await API.search({
        type: 'artists',
        query: 'Dream Theater',
        limit: 1,
      });
      !err && data && setArtists(data.artists.items);
    };
    foo();
  }, [API]);

  useEffect(() => {
    const foo = async () => {
      const [err, playlists] = await API.getPlaylistsAsync();
      !err && playlists && setPlaylists(playlists);
    };
    foo();
  }, [API]);

  useEffect(() => {
    console.log('selection:', selection);
  }, [selection]);

  const playlistsRows3 = playlists.map(
    ({
      isDuplicate: dup,
      uuid: id,
      devID,
      title,
      numberOfTracks,
      created,
    }) => ({
      dup,
      id,
      // title: devID || title,
      title,
      numberOfTracks,
      created, //new Date(created).toLocaleDateString(),
    })
  );

  const filteredPlaylistsRows = getFilteredPlaylistSpotify(playlists).map(
    ({
      // isDuplicate: dup,
      uuid: id,
      devID,
      title,
      numberOfTracks,
      created,
    }) => ({
      // dup,
      id,
      // title: devID || title,
      title,
      numberOfTracks,
      created, //new Date(created).toLocaleDateString(),
    })
  );

  const markedPlaylistsRows2 = getDuplicatesOnly(playlists).map(
    ({
      isDuplicate: dup,
      uuid: id,
      devID,
      title,
      numberOfTracks,
      created,
    }) => ({
      dup,
      id,
      title,
      // title: devID || title,
      numberOfTracks,

      created, //new Date(created).toLocaleDateString(),
    })
  );

  const handlePlaylistItems = async () => {
    await handleDuplicatePlaylists(playlists, API);
  };

  const renamePlaylistDesc = async () =>
    selection.forEach((uuid) =>
      API.renamePlaylist(uuid, { description: 'Imported from Spotify' })
    );

  const showPlaylistItems = async () => {
    // console.log('items', await getPlaylistMissingTracks(selection, API));
  };

  const fromMapPlaylistsRows = Object.entries(
    getDuplicateMapList(playlists)
  ).reduce(
    (acc, [, titlePlaylists]: [string, IPlaylist[]], idx, arr) => [
      ...acc,
      ...(titlePlaylists.length > 1
        ? titlePlaylists.map(
            (
              {
                uuid: id, // devID,
                title,
                numberOfTracks,
                created,
              },
              idx,
              { length: dup }
            ) => ({
              dup,
              id,
              title,
              // title: devID || title,
              numberOfTracks,

              created, //new Date(created).toLocaleDateString(),
            })
          )
        : []),
    ],
    []
  );

  const columns = [
    {
      field: 'dup',
      flex: 0.1,
      type: 'string',
    },
    {
      field: 'title',
      flex: 0.25,
      type: 'string',
    },
    { field: 'numberOfTracks', flex: 0.25, type: 'number' },
    { field: 'created', flex: 0.25, type: 'dateTime' },
  ];

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      {/* <SimpleModal /> */}
    </div>
  );

  const deletePL = async () => {
    selection.forEach(async (id) => {
      console.log(
        `before delete - playlist ${id}: `,
        await API.checkIfPlaylistExists(id, 'uuid')
      );
      await API.deletePlaylist(id);
      console.log(
        `after delete - playlist ${id}: `,
        await API.checkIfPlaylistExists(id, 'uuid')
      );
    });
  };

  return (
    <div className={styles.app}>
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>artists</h1>
      </header>
      <main>
        <button
          type="button"
          onClick={() => {
            deletePL();
          }}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => {
            showPlaylistItems();
          }}
        >
          log playlist items
        </button>
        <button
          type="button"
          onClick={() => {
            handlePlaylistItems();
          }}
        >
          merge dup playlist items
        </button>
        <button
          type="button"
          onClick={() => {
            renamePlaylistDesc();
          }}
        >
          renamePlaylistDesc
        </button>
        {/* <button type="button" onClick={handleOpen}>
          Open Modal
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal> */}
        {/* <h1>playlists</h1>
        <div style={{ height: 500, width: '50%' }}>
          <DataGrid columns={columns} rows={playlistsRows} />
        </div> */}
        <h1>marked playlists</h1>
        <div style={{ height: '100vh', width: '100%' }}>
          <DataGrid
            columns={columns}
            // rows={fromMapPlaylistsRows}
            rows={filteredPlaylistsRows}
            checkboxSelection
            onSelectionChange={(newSelection) => {
              setSelection(newSelection.rowIds);
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
