import React, { useState, useEffect } from 'react';

import styles from './app.module.scss';
import { username, password } from '../../../../creds.json';

import { ReactComponent as Logo } from './logo.svg';
import { TidalAPI } from '@tidal-gui/api';
import {
  getDuplicates,
  getMarkedDuplicateList,
} from './helpers/find-duplicates';
import { IPlaylist } from '@tidal-gui/api';

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

  const [artists, setArtists] = useState([{ name: 'wait...' }]);
  const [playlists, setPlaylists] = useState([]);

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
      const [err, playlists] = await API.getPlaylists();
      !err && playlists && setPlaylists(playlists.items);
    };
    foo();
  }, [API]);

  return (
    <div className={styles.app}>
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>artists</h1>
      </header>
      <main>
        <ul>
          {artists?.map((item) => (
            <li>{item.name}</li>
          ))}
        </ul>
        <h1>playlists</h1>
        <table>
          <tbody>
            <tr>
              <td>
                <h1>playlists</h1>
                <table>
                  <tbody>
                    {playlists?.map((item) => (
                      <tr>
                        <td
                          style={{
                            backgroundColor: item.isDuplicate ? 'red' : 'green',
                          }}
                        >
                          {item.devID || item.title}
                        </td>
                        <td>{item.numberOfTracks}</td>
                        <td>{new Date(item.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>
                <h1>playlists duplicates</h1>
                <table>
                  <tbody>
                    {getMarkedDuplicateList(playlists).map(
                      (item: IPlaylist) => (
                        <tr>
                          <td
                            style={{
                              backgroundColor: item.isDuplicate
                                ? 'red'
                                : 'green',
                            }}
                          >
                            {item.devID || item.title}
                          </td>
                          <td>{item.numberOfTracks}</td>
                          <td>{new Date(item.created).toLocaleDateString()}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
