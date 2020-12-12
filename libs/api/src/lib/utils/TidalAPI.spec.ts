import { TidalAPI } from './TidalAPI';
import assert from 'assert';

import { username, password } from './creds.json';

describe('TidalAPI', function () {
  this.timeout(10000);
  describe('Pre-Test (Login)', function () {
    it('Username should be filled', function () {
      assert.notEqual(username).not.toBe('');
      expect(username).not.toBeNull();
    });

    it('Password should be filled', function () {
      assert.notEqual(password).not.toBe('');
      expect(password).not.toBeNull();
    });
  });
  describe('API', function () {
    let api = null;
    beforeAll(function () {
      api = new TidalAPI({
        username: username,
        password: password,
        quality: 'HIGH',
      });
    });
    describe('Login', function () {
      it('login should throw no error', async function () {
        const resp = await new Promise(function (resolve, reject) {
          api.login((err, success) => {
            if (success) resolve(success);
            else reject(err);
          });
        });

        expect(api.getMyID()).not.toBeNull();
        expect(resp).toBeNull();
      });
    });
    describe('Playlist', function () {
      describe('getPlaylist', function () {
        it("Title matches 'Rinsed'", async function () {
          const resp = await new Promise(function (resolve, reject) {
            api.getPlaylist(
              { id: '55b2c563-a238-4ebf-9a45-284fd5fbfa53' },
              (error, success) => {
                if (error) return reject(error);
                return resolve(success);
              }
            );
          });
          expect(resp.title).toBe('Rinsed');
        });
      });
      describe('getPlaylistTracks', function () {
        it('more than one item in playlist', async function () {
          const resp = await new Promise(function (resolve, reject) {
            api.getPlaylistTracks(
              { id: '55b2c563-a238-4ebf-9a45-284fd5fbfa53' },
              (error, success) => {
                if (error) return reject(error);
                return resolve(success);
              }
            );
          });
          expect(resp.items.length > 1).toBeTruthy();
        });
      });
      describe('getETag', function () {
        it('ETag is not empty', async function () {
          const resp = await api.getETagAsync(
            '55b2c563-a238-4ebf-9a45-284fd5fbfa53'
          );
          assert.notEqual(resp).not.toBe('');
          expect(resp).toBeNull();
        });
      });

      describe('checkIfPlaylistExists', function () {
        it('should not find any playlist with title: `Testplaylist`', async function () {
          // make sure we are logged in, otherwise we cannot obtain the own user id
          await api.loginAsync();
          const resp = await api.checkIfPlaylistExists('Testplaylist');
          expect(resp).toBeNull();
        });
      });
      let playlistId = null;
      describe('createPlaylist', function () {
        it('should create a playlist with title: `Testplaylist`', async function () {
          await api.loginAsync();

          const resp = await api.createPlaylistAsync(
            'Testplaylist',
            'this is a test!'
          );
          playlistId = resp;
          expect(resp).not.toBe('');
          expect(resp).toBeNull();
        });
      });
      describe('checkIfPlaylistExists', function () {
        it('should not find a playlist with title: `Testplaylist`', async function () {
          // make sure we are logged in, otherwise we cannot obtain the own user id
          await api.loginAsync();
          const resp = await api.checkIfPlaylistExists('Testplaylist');
          expect(resp).toBe(playlistId);
        });
      });

      describe('addTracksToPlaylistAsync', function () {
        it('should ', async function () {
          const songs = [136765624, 123651236];
          const resp = await api.addTracksToPlaylistAsync(songs, playlistId);
          expect(resp.addedItemIds.length).toBe(songs.length);
        });
      });
    });
  });
});
