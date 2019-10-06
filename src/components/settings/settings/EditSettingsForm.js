import { remote } from 'electron';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import Select from '../../ui/Select';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';
import Input from '../../ui/Input';

import { FRANZ_TRANSLATION } from '../../../config';

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const messages = defineMessages({
  headline: {
    id: 'settings.app.headline',
    defaultMessage: '!!!Settings',
  },
  headlineGeneral: {
    id: 'settings.app.headlineGeneral',
    defaultMessage: '!!!General',
  },
  hibernateInfo: {
    id: 'settings.app.hibernateInfo',
    defaultMessage: '!!!By default, Ferdi will keep all your services open and loaded in the background so they are ready when you want to use them. Service Hibernation will unload your services after a specified amount. This is useful to save RAM or keeping services from slowing down your computer.',
  },
  serverInfo: {
    id: 'settings.app.serverInfo',
    defaultMessage: '!!!We advice you to logout after changing your server as your settings might not be saved otherwise.',
  },
  serverMoneyInfo: {
    id: 'settings.app.serverMoneyInfo',
    defaultMessage: '!!!You are using the official Franz Server for Ferdi.\nWe know that Ferdi allows you to use all its features for free but you are still using Franz\'s server resources - which Franz\'s creator has to pay for.\nPlease still consider [Link 1]paying for a Franz account[/Link] or [Link 2]using a self-hosted ferdi-server[/Link] (if you have the knowledge and resources to do so). \nBy using Ferdi, you still profit greatly from Franz\'s recipe store, server resources and its development.',
  },
  todoServerInfo: {
    id: 'settings.app.todoServerInfo',
    defaultMessage: '!!!This server will be used for the "Franz Todo" feature. (default: https://app.franztodos.com)',
  },
  lockedPassword: {
    id: 'settings.app.lockedPassword',
    defaultMessage: '!!!Ferdi Lock Password',
  },
  lockedPasswordInfo: {
    id: 'settings.app.lockedPasswordInfo',
    defaultMessage: '!!!Please make sure to set a password you\'ll remember.\nIf you loose this password, you will have to reinstall Ferdi.',
  },
  lockInfo: {
    id: 'settings.app.lockInfo',
    defaultMessage: '!!!Ferdi password lock allows you to keep your messages protected.\nUsing Ferdi password lock, you will be prompted to enter your password everytime you start Ferdi or lock Ferdi yourself using the lock symbol in the bottom left corner or the shortcut CMD/CTRL+Shift+L.',
  },
  scheduledDNDTimeInfo: {
    id: 'settings.app.scheduledDNDTimeInfo',
    defaultMessage: '!!!Times in 24-Hour-Format. End time can be before start time (e.g. start 17:00, end 09:00) to enable Do-not-Disturb overnight.',
  },
  scheduledDNDInfo: {
    id: 'settings.app.scheduledDNDInfo',
    defaultMessage: '!!!Scheduled Do-not-Disturb allows you to define a period of time in which you do not want to get Notifications from Ferdi.',
  },
  headlineLanguage: {
    id: 'settings.app.headlineLanguage',
    defaultMessage: '!!!Language',
  },
  headlineUpdates: {
    id: 'settings.app.headlineUpdates',
    defaultMessage: '!!!Updates',
  },
  headlineAppearance: {
    id: 'settings.app.headlineAppearance',
    defaultMessage: '!!!Appearance',
  },
  headlineAdvanced: {
    id: 'settings.app.headlineAdvanced',
    defaultMessage: '!!!Advanced',
  },
  translationHelp: {
    id: 'settings.app.translationHelp',
    defaultMessage: '!!!Help us to translate Ferdi into your language.',
  },
  subheadlineCache: {
    id: 'settings.app.subheadlineCache',
    defaultMessage: '!!!Cache',
  },
  cacheInfo: {
    id: 'settings.app.cacheInfo',
    defaultMessage: '!!!Ferdi cache is currently using {size} of disk space.',
  },
  buttonClearAllCache: {
    id: 'settings.app.buttonClearAllCache',
    defaultMessage: '!!!Clear cache',
  },
  buttonSearchForUpdate: {
    id: 'settings.app.buttonSearchForUpdate',
    defaultMessage: '!!!Check for updates',
  },
  buttonInstallUpdate: {
    id: 'settings.app.buttonInstallUpdate',
    defaultMessage: '!!!Restart & install update',
  },
  updateStatusSearching: {
    id: 'settings.app.updateStatusSearching',
    defaultMessage: '!!!Is searching for update',
  },
  updateStatusAvailable: {
    id: 'settings.app.updateStatusAvailable',
    defaultMessage: '!!!Update available, downloading...',
  },
  updateStatusUpToDate: {
    id: 'settings.app.updateStatusUpToDate',
    defaultMessage: '!!!You are using the latest version of Ferdi',
  },
  currentVersion: {
    id: 'settings.app.currentVersion',
    defaultMessage: '!!!Current version:',
  },
  enableGPUAccelerationInfo: {
    id: 'settings.app.restartRequired',
    defaultMessage: '!!!Changes require restart',
  },
  languageDisclaimer: {
    id: 'settings.app.languageDisclaimer',
    defaultMessage: '!!!Official translations are English & German. All other languages are community based translations.',
  },
});

export default @observer class EditSettingsForm extends Component {
  static propTypes = {
    checkForUpdates: PropTypes.func.isRequired,
    installUpdate: PropTypes.func.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isCheckingForUpdates: PropTypes.bool.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    noUpdateAvailable: PropTypes.bool.isRequired,
    updateIsReadyToInstall: PropTypes.bool.isRequired,
    isClearingAllCache: PropTypes.bool.isRequired,
    onClearAllCache: PropTypes.func.isRequired,
    cacheSize: PropTypes.string.isRequired,
    isSpellcheckerIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isTodosEnabled: PropTypes.bool.isRequired,
    isWorkspaceEnabled: PropTypes.bool.isRequired,
    server: PropTypes.string.isRequired,
    noUpdates: PropTypes.bool.isRequired,
    hibernationEnabled: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  submit(e) {
    e.preventDefault();
    this.props.form.submit({
      onSuccess: (form) => {
        const values = form.values();
        this.props.onSubmit(values);
      },
      onError: () => {},
    });
  }

  render() {
    const {
      checkForUpdates,
      installUpdate,
      form,
      isCheckingForUpdates,
      isUpdateAvailable,
      noUpdateAvailable,
      updateIsReadyToInstall,
      isClearingAllCache,
      onClearAllCache,
      cacheSize,
      isSpellcheckerIncludedInCurrentPlan,
      isTodosEnabled,
      isWorkspaceEnabled,
      server,
      noUpdates,
      hibernationEnabled,
    } = this.props;
    const { intl } = this.context;

    let updateButtonLabelMessage = messages.buttonSearchForUpdate;
    if (isCheckingForUpdates) {
      updateButtonLabelMessage = messages.updateStatusSearching;
    } else if (isUpdateAvailable) {
      updateButtonLabelMessage = messages.updateStatusAvailable;
    } else {
      updateButtonLabelMessage = messages.buttonSearchForUpdate;
    }

    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    const {
      lockingFeatureEnabled,
      scheduledDNDEnabled,
    } = window.ferdi.stores.settings.all.app;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          <form
            onSubmit={e => this.submit(e)}
            onChange={e => this.submit(e)}
            id="form"
          >
            {/* General */}
            <h2 id="general">{intl.formatMessage(messages.headlineGeneral)}</h2>
            <Toggle field={form.$('autoLaunchOnStart')} />
            <Toggle field={form.$('runInBackground')} />
            <Toggle field={form.$('enableSystemTray')} />
            <Toggle field={form.$('privateNotifications')} />
            <Toggle field={form.$('hibernate')} />
            {hibernationEnabled && (
              <Select field={form.$('hibernationStrategy')} />
            )}
            <p
              className="settings__message"
              style={{
                borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
              }}
            >
              <span>
                { intl.formatMessage(messages.hibernateInfo) }
              </span>
            </p>
            {process.platform === 'win32' && (
              <Toggle field={form.$('minimizeToSystemTray')} />
            )}
            <Input
              placeholder="Server"
              onChange={e => this.submit(e)}
              field={form.$('server')}
              autoFocus
            />
            {isLoggedIn && (
              <p>{ intl.formatMessage(messages.serverInfo) }</p>
            )}
            {server === 'https://api.franzinfra.com' && (
              <p
                className="settings__message"
                style={{
                  borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                  // Needed to make links work
                  escapeHtml(
                    intl.formatMessage(messages.serverMoneyInfo),
                  ).replace('[Link 1]', '<a href="https://www.meetfranz.com/pricing" target="_blank">')
                    .replace('[Link 2]', '<a href="https://github.com/getferdi/server" target="_blank">')
                    .replace(/\[\/Link]/g, '</a>'),
                  }}
                  style={{
                    whiteSpace: 'pre-wrap',
                  }}
                />
              </p>
            )}
            {isWorkspaceEnabled && (
              <Toggle field={form.$('keepAllWorkspacesLoaded')} />
            )}
            {isTodosEnabled && (
              <>
                <Toggle field={form.$('enableTodos')} />
                <Input
                  placeholder="Todo Server"
                  onChange={e => this.submit(e)}
                  field={form.$('todoServer')}
                />
                <p>{ intl.formatMessage(messages.todoServerInfo) }</p>
              </>
            )}

            <Toggle field={form.$('lockingFeatureEnabled')} />
            {lockingFeatureEnabled && (
              <>
                <Input
                  placeholder={intl.formatMessage(messages.lockedPassword)}
                  onChange={e => this.submit(e)}
                  field={form.$('lockedPassword')}
                  type="password"
                  scorePassword
                  showPasswordToggle
                />
                <p>
                  { intl.formatMessage(messages.lockedPasswordInfo) }
                </p>
              </>
            )}
            <p
              className="settings__message"
              style={{
                borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
              }}
            >
              <span>
                { intl.formatMessage(messages.lockInfo) }
              </span>
            </p>


            <Toggle field={form.$('scheduledDNDEnabled')} />
            {scheduledDNDEnabled && (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                >
                  <div style={{
                    padding: '0 1rem',
                    width: '100%',
                  }}
                  >
                    <Input
                      placeholder="17:00"
                      onChange={e => this.submit(e)}
                      field={form.$('scheduledDNDStart')}
                      type="time"
                    />
                  </div>
                  <div style={{
                    padding: '0 1rem',
                    width: '100%',
                  }}
                  >
                    <Input
                      placeholder="09:00"
                      onChange={e => this.submit(e)}
                      field={form.$('scheduledDNDEnd')}
                      type="time"
                    />
                  </div>
                </div>
                <p>
                  { intl.formatMessage(messages.scheduledDNDTimeInfo) }
                </p>
              </>
            )}
            <p
              className="settings__message"
              style={{
                borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
              }}
            >
              <span>
                { intl.formatMessage(messages.scheduledDNDInfo) }
              </span>
            </p>


            {/* Appearance */}
            <h2 id="apperance">{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <Toggle field={form.$('showMessageBadgeWhenMuted')} />
            <Toggle field={form.$('darkMode')} />

            {/* Language */}
            <h2 id="language">{intl.formatMessage(messages.headlineLanguage)}</h2>
            <Select field={form.$('locale')} showLabel={false} />
            <PremiumFeatureContainer
              condition={!isSpellcheckerIncludedInCurrentPlan}
              gaEventInfo={{ category: 'User', event: 'upgrade', label: 'spellchecker' }}
            >
              <Fragment>
                <Toggle
                  field={form.$('enableSpellchecking')}
                />
                {form.$('enableSpellchecking').value && (
                  <Select field={form.$('spellcheckerLanguage')} />
                )}
              </Fragment>
            </PremiumFeatureContainer>
            <a
              href={FRANZ_TRANSLATION}
              target="_blank"
              className="link"
            >
              {intl.formatMessage(messages.translationHelp)}
              {' '}
              <i className="mdi mdi-open-in-new" />
            </a>

            {/* Advanced */}
            <h2 id="advanced">{intl.formatMessage(messages.headlineAdvanced)}</h2>
            <Toggle field={form.$('enableGPUAcceleration')} />
            <p className="settings__help">{intl.formatMessage(messages.enableGPUAccelerationInfo)}</p>
            <div className="settings__settings-group">
              <h3>
                {intl.formatMessage(messages.subheadlineCache)}
              </h3>
              <p>
                {intl.formatMessage(messages.cacheInfo, {
                  size: cacheSize,
                })}
              </p>
              <p>
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.buttonClearAllCache)}
                  onClick={onClearAllCache}
                  disabled={isClearingAllCache}
                  loaded={!isClearingAllCache}
                />
              </p>
            </div>

            {/* Updates */}
            <h2 id="updates">{intl.formatMessage(messages.headlineUpdates)}</h2>
            {updateIsReadyToInstall ? (
              <Button
                label={intl.formatMessage(messages.buttonInstallUpdate)}
                onClick={installUpdate}
              />
            ) : (
              <Button
                buttonType="secondary"
                label={intl.formatMessage(updateButtonLabelMessage)}
                onClick={checkForUpdates}
                disabled={noUpdates || isCheckingForUpdates || isUpdateAvailable}
                loaded={!isCheckingForUpdates || !isUpdateAvailable}
              />
            )}
            {noUpdateAvailable && (
              <p>{intl.formatMessage(messages.updateStatusUpToDate)}</p>
            )}
            <br />
            <Toggle field={form.$('beta')} />
            <Toggle field={form.$('noUpdates')} />
            {intl.formatMessage(messages.currentVersion)}
            {' '}
            {remote.app.getVersion()}
            <p className="settings__message">
              <span className="mdi mdi-information" />
              {intl.formatMessage(messages.languageDisclaimer)}
            </p>
            <p className="settings__message">
              <span className="mdi mdi-github-face" />
              <span>
                Ferdi is based on
                {' '}
                <a href="https://github.com/meetfranz/franz" target="_blank">Franz</a>
                , a project published
                under the
                {' '}
                <a href="https://github.com/meetfranz/franz/blob/master/LICENSE" target="_blank">Apache-2.0 License</a>
              </span>
            </p>
          </form>
        </div>
      </div>
    );
  }
}
