import { IBaseArgs } from './../api.d';
//Node.js modules
import { AxiosResponse, default as axios } from 'axios';
const baseURL = 'https://api.tidalhifi.com/v1';

/**
 * Package.json of TidalAPI
 * @type {exports}
 * @private
 */
// let TidalAPIInfo = require('../package.json');

/**
 * Authentication information (username and password)
 * @type {Object}
 * @private
 */
let authInfo;

/**
 * TIDAL API Session ID
 * @type {null|String}
 * @private
 */
let _sessionID = null;

/**
 * TIDAL API Country code
 * @type {null|String}
 * @private
 */
let _countryCode = null;

/**
 * TIDAL API User ID
 * @type {null|String}
 * @private
 */
let _userID = null;

/**
 * TIDAL API stream quality
 * @type {null|String}
 * @private
 */
let _streamQuality = null;

/**
 * api logged in
 * @type {null|String}
 */
let loggedIn = false;

/**
 * authData
 * @type {Object}
 */
let authData = {};

/**
 * Create TidalAPI instance
 * @param {{username: String, password: String, token: String, quality: String}}
 * @Constructor
 */

function TidalAPI(authData) {
  if (typeof authData !== 'object') {
    throw new Error(
      'You must pass auth data into the TidalAPI object correctly'
    );
  } else {
    if (typeof authData.username !== 'string') {
      throw new Error('Username invalid or missing');
    }
    if (typeof authData.password !== 'string') {
      throw new Error('Password invalid or missing');
    }
    if (typeof authData.quality !== 'string') {
      throw new Error('Stream quality invalid or missing');
    }
  }

  this.authData = authData;

  /* try log in */
  // tryLogin(authData);
}
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
/**
 * Try login using credentials.
 * @param {{username: String, password: String}}
 */
async function tryLogin(authInfo) {
  /**
   * Logging?
   * @type {boolean}
   */
  let loggingIn = true;
  return axios
    .request({
      method: 'POST',
      url: baseURL + '/login/username',
      headers: {
        'X-Tidal-Token': 'wc8j_yBJd20zOmx0',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formUrlEncoded({
        username: authInfo.username,
        password: authInfo.password,
      }),
    })
    .then(function (res) {
      const data = res.data;
      _sessionID = data.sessionId;
      _userID = data.userId;
      _countryCode = data.countryCode;
      _streamQuality = authInfo.quality;
      loggingIn = false;
      loggedIn = true;

      return [null, true];
    })
    .catch((reason) => [reason, false]);
}
/**
 * Return userID.
 */
TidalAPI.prototype.getMyID = function () {
  return _userID;
};
/**
 * Global search.
 * @param {{query: String, limit: Number, types: String, offset: Number}}
 */
TidalAPI.prototype.search = async function (query) {
  let self = this;

  const args: IBaseArgs = {
    url: '/search',
    params: {
      query: query.query || query,
      limit: query.limit || 999,
      types: query.type || 'ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS',
      offset: query.offset || 0,
      countryCode: _countryCode,
    },
    type: 'search',
  };

  return await self._baseRequest(args);
};
/**
 * Get artist info.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtist = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query),
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode,
    },
    type: 'artist',
  };
  return self._baseRequest(args);
};
/**
 * Get artist top tracks.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getTopTracks = function (query) {
  let self = this;

  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query) + '/toptracks',
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode,
    },
    type: 'toptracks',
  };

  return self._baseRequest(args);
};
/**
 * Get artist videos.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtistVideos = function (query) {
  let self = this;

  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query) + '/videos',
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'videos',
  };

  return self._baseRequest(args);
};
/**
 * Get artist bio.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getArtistBio = function (query) {
  let self = this;

  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query) + '/bio',

    type: 'bio',
  };

  return self._baseRequest();
};
/**
 * Get similar artists.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getSimilarArtists = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query) + '/similar',

    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'similar',
  };

  return self._baseRequest();
};
/**
 * Get artist albums.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtistAlbums = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/artists/' + (query.id || query) + '/albums',
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'albums',
  };

  return self._baseRequest();
};
/**
 * Get album info.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getAlbum = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/albums/' + (query.id || query),

    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'album',
  };

  return self._baseRequest();
};
/**
 * Get album tracks.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getAlbumTracks = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/albums/' + (query.id || query) + '/tracks',

    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'albums',
  };

  return self._baseRequest();
};
/**
 * Get playlist info.
 * @param {{id: String, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getPlaylist = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/playlists/' + (query.id || query),
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'album',
  };

  return self._baseRequest();
};
/**
 * Get tracks from a playlist.
 * @param {{id: String, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getPlaylistTracks = function (query) {
  let self = this;
  const args: IBaseArgs = {
    url: '/playlists/' + (query.id || query) + '/tracks',
    params: {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
    },
    type: 'albums',
  };

  return self._baseRequest(args).then(([err, { items }]) => [err, items]);
};
/**
 * Get track info.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getTrackInfo = function (track) {
  let self = this;
  const args: IBaseArgs = {
    url: `/tracks/${track.id || track}`,
    type: 'trackInfo',
  };

  return self._baseRequest(args);
};
/**
 * Get track stream URL.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getStreamURL = function (track) {
  let self = this;
  const args: IBaseArgs = {
    url: '/tracks/' + (track.id || track) + '/streamUrl',
    params: {
      soundQuality: track.quality || _streamQuality,
    },
    type: 'streamURL',
  };

  return self._baseRequest();
};
/**
 * Get track stream URL.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getOfflineURL = function (track) {
  let self = this;
  const args: IBaseArgs = {
    url: '/tracks/' + (track.id || track) + '/offlineUrl',

    params: {
      soundQuality: track.quality || _streamQuality,
    },
    type: 'streamURL',
  };

  return self._baseRequest();
};
/**
 * Get video stream URL.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getVideoStreamURL = function (track) {
  let self = this;
  const args: IBaseArgs = {
    url: '/videos/' + (track.id || track) + '/streamUrl',

    type: 'streamURL',
  };

  return self._baseRequest();
};
/**
 * Get user info.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getUser = function (user) {
  let self = this;
  const args: IBaseArgs = {
    url: '/users/' + (user.id || user),
    params: {
      limit: user.limit || 999,
      offset: user.offset || 0,
    },
    type: 'user',
  };

  return self._baseRequest();
};
/**
 * Get user playlists.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getPlaylists = async function (user?) {
  let self = this;
  return self._baseRequest({
    paramsBuilder: () => ({
      url: `/users/${encodeURIComponent(
        user?.id || user || this.getMyID()
      )}/playlists`,
      params: {
        limit: user?.limit || 999,
        offset: user?.offset || 0,
      },
      type: 'userPlaylists',
    }),
  });
};

/**
 * Get user playlists asynchronous
 * @param {{id: Number}}
 */
TidalAPI.prototype.getPlaylistsAsync = async function (user?) {
  return await this.getPlaylists(user).then(([err, { items = [] } = {}]) => [
    err,
    items,
  ]);
};
/**
 * Gets the ETag Header from a given Playlist, required for editing
 * @param playlistId
 * @returns {Promise<string>}
 */
TidalAPI.prototype.getETagAsync = async function getETagAsync(playlistId) {
  const self = this;

  return await this._baseRequest({
    url: `/playlists/${encodeURIComponent(playlistId)}`,
  }).then(([err, , { etag }]) => [err, etag]);
};
/**
 * Gets the ETag Header from a given Playlist, required for editing
 * @param playlistId
 * @returns {Promise<string>}
 */
TidalAPI.prototype.deletePlaylist = async function deletePlaylist(playlistId) {
  const self = this;

  return await this._baseRequest({
    url: `/playlists/${encodeURIComponent(playlistId)}`,
    method: 'DELETE',
  });
};

TidalAPI.prototype.renamePlaylist = async function (playlistId, params) {
  const self = this;

  return await this._baseRequest({
    url: `/playlists/${encodeURIComponent(playlistId)}`,
    method: 'POST',
    setParamsAsFormData: true,
    params,
  });
};

TidalAPI.prototype.addTracksToPlaylistAsync = async function addTracksToPlaylistAsync(
  songIds,
  playlistId
) {
  const self = this;
  const [err, etag] = await self.getETagAsync(playlistId);
  if (err || !etag) return [err, null];

  return this._baseRequest({
    url: `/playlists/${encodeURIComponent(playlistId)}/items`,
    params: {
      trackIds: songIds.join(','),
      // onDupes: 'FAIL',
      onDupes: 'SKIP',
    },
    method: 'POST',
    additionalHeaders: { 'If-None-Match': etag },
    setParamsAsFormData: true,
  });
};

// TidalAPI.prototype.getPlaylistTracks = async function (playlistId, query) {
//   const self = this;

//   return self
//     ._baseRequest({
//       url: `/playlists/${encodeURIComponent(playlistId)}/items`,
//       params: {
//         limit: query?.limit || 999,
//         filter: query?.filter || 'ALL',
//         offset: query?.offset || 0,
//       },
//       method: 'GET',
//     })
//     .then(([err, { items }]) => [err, items]);
// };
/**
 * Checks whether a playlist with a given title is already in the users library
 * @param title {string} Title of the playlist
 * @returns {Promise<null|string>} `null` if no playlist was found, otherwise the UUID of the matching Playlist
 */
TidalAPI.prototype.checkIfPlaylistExists = async function (
  value,
  key = 'title'
) {
  const [err, myPlaylists] = await this.getPlaylistsAsync(this.getMyID());
  if (!err && myPlaylists) {
    for (let i = 0; i < myPlaylists.length; i++) {
      if (myPlaylists[i][key] === value) {
        return myPlaylists[i].uuid;
      }
    }
  }
  return null;
};
/**
 * Creates a new playlist in the users library
 * @param title {string} Title of the playlist
 * @param description {string} Description of the playlist
 * @returns {Promise<string>} UUID of the created playlist
 */
TidalAPI.prototype.createPlaylistAsync = async function (title, description) {
  const self = this;

  const [err, { uuid }] = await this._baseRequest({
    url: `/users/${encodeURIComponent(
      this.getMyID()
    )}/playlists?countryCode=${encodeURIComponent(_countryCode)}`,
    params: {
      title: title,
      description: description,
    },
    method: 'POST',
    setParamsAsFormData: true,
  });
  return [err, uuid];
};

/**
 * Creates a new playlist if no other with the given name was found
 * @param title {string} Title of the playlist
 * @param description {string} Description of the playlist
 * @returns {Promise<string>} UUID of the playlist
 */
TidalAPI.prototype.createPlaylistIfNotExistsAsync = async function (
  title,
  description
) {
  const exists = await this.checkIfPlaylistExists(title);
  if (exists) return exists;
  return await this.createPlaylistAsync(title, description);
};

/**
 * Get track stream URL.
 * @param {id: String, res: Number}
 */

TidalAPI.prototype.getArtURL = function (id, width, height) {
  width = width || 1280;
  height = height || 1280;
  return (
    'https://resources.tidal.com/images/' +
    id.replace(/-/g, '/') +
    '/' +
    width +
    'x' +
    height +
    '.jpg'
  );
};
/**
 * Generate Metaflac tags.
 * @param {{id: Number}}
 */
TidalAPI.prototype.genMetaflacTags = async function (track) {
  let self = this;
  const [err, data] = await self.getTrackInfo({ id: track.id || track });
  if (!err && data) {
    const [err, albumData] = await self.getAlbum({ id: data.album.id });
    if (!err && albumData) {
      let metaflacTag;
      metaflacTag = '--remove-all-tags ';
      metaflacTag += '--set-tag="ARTIST=' + data.artist.name + '" ';
      metaflacTag += '--set-tag="TITLE=' + data.title + '" ';
      metaflacTag += '--set-tag="ALBUM=' + data.album.title + '" ';
      metaflacTag += '--set-tag="TRACKNUMBER=' + data.trackNumber + '" ';
      metaflacTag += '--set-tag="COPYRIGHT=' + data.copyright + '" ';
      metaflacTag +=
        '-set-tag="DATE=' + albumData.releaseDate.split('-')[0] + '" ';
      if (track.coverPath) {
        metaflacTag += '--import-picture-from=' + '"' + track.coverPath + '" ';
      }
      if (track.songPath) {
        metaflacTag += '"' + track.songPath + '" ';
      }
      metaflacTag += '--add-replay-gain';
      return [err, metaflacTag];
    }
    return [err, albumData];
  }
  return [err, data];
};

TidalAPI.prototype.login = async function (cb) {
  return await tryLogin(this.authData);
};

TidalAPI.prototype.loginAsync = async function () {
  return await tryLogin(this.authData);
};
/**
 * Base request function.
 * @param {{method: String, params: Object, type: String}}
 */
TidalAPI.prototype._baseRequest = async function (args: IBaseArgs) {
  let self = this;

  if (!loggedIn) {
    const [err, ok] = await tryLogin(this.authData);
    if (!err && ok) {
      return await self._baseRequest(args);
    }
    return [err, ok];
  }

  let {
    url,
    params = {},
    // type,
    method = 'GET',
    additionalHeaders = {},
    setParamsAsFormData,
  } = args;

  if (args.paramsBuilder) {
    ({
      url,
      params = {},
      // type,
      method = 'GET',
      additionalHeaders = {},
      setParamsAsFormData,
    } = args.paramsBuilder());
  }

  if (setParamsAsFormData) {
    params = (formUrlEncoded(params) as unknown) as Record<string, unknown>;
    additionalHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else {
    params.countryCode = params.countryCode ? params.countryCode : _countryCode;
  }

  return axios
    .request({
      method,
      url: baseURL + url,
      headers: {
        Origin: 'http://listen.tidal.com',
        'X-Tidal-SessionId': _sessionID,
        ...additionalHeaders,
      },
      params,
      data: params,
    })
    .then(function (res: AxiosResponse<any>) {
      const { data: body, headers } = res;
      const types = params?.types as string;

      if (types) {
        const newBody = {};
        if (types.indexOf('tracks') > -1) {
          newBody['tracks'] = body.tracks;
        }
        if (types.indexOf('artists') > -1) {
          newBody['artists'] = body.artists;
        }
        if (types.indexOf('albums') > -1) {
          newBody['albums'] = body.albums;
        }
        if (types.indexOf('videos') > -1) {
          newBody['videos'] = body.videos;
        }
        if (types.indexOf('playlists') > -1) {
          newBody['playlists'] = body.playlists;
        }
        return [null, newBody, headers];
      } else return [null, body, headers];
    })
    .catch((err) => {
      return [err, null, null];
    });
};

export { TidalAPI };
