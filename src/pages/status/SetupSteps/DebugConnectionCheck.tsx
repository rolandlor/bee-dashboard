import MuiAlert from '@material-ui/lab/Alert'
import { ReactElement, useContext } from 'react'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemInput from '../../../components/ExpandableListItemInput'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import StatusIcon from '../../../components/StatusIcon'
import { CheckState, Context } from '../../../providers/Bee'
import { Context as SettingsContext } from '../../../providers/Settings'

export default function NodeConnectionCheck(): ReactElement | null {
  const { status, isLoading } = useContext(Context)
  const { setDebugApiUrl, apiDebugUrl, isDesktop } = useContext(SettingsContext)
  const { checkState, isEnabled } = status.debugApiConnection

  if (!isEnabled) return null

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon checkState={checkState} isLoading={isLoading} /> Connection to Bee Debug API
        </>
      }
    >
      <ExpandableListItemNote>
        {checkState === CheckState.OK
          ? 'The connection to the Bee node debug API has been successful'
          : 'Could not connect to your Bee node debug API.'}
      </ExpandableListItemNote>
      <ExpandableListItemInput label="Bee Debug API" value={apiDebugUrl} onConfirm={setDebugApiUrl} />

      {checkState === CheckState.ERROR && !isDesktop && (
        <ExpandableList level={1} label="Troubleshoot">
          <ExpandableListItem
            label={
              <ol>
                <li>Check the status of your node by running the below command to see if your node is running.</li>
                <CodeBlockTabs showLineNumbers linux={`sudo systemctl status bee`} mac={`brew services list`} />
                <li>
                  If your node is running, check your firewall settings to make sure that port 1635 (or your custom
                  specified port) is bound to localhost. If your node is not running try executing the below command to
                  start your bee node
                </li>
                <MuiAlert
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                  elevation={6}
                  variant="filled"
                  severity="error"
                >
                  Your debug node API should never be completely open to the internet. If you want to connect remotely,
                  make sure your firewall settings are set to only allow specific trusted IP addresses and block all
                  other ports. A simple google search for &quot;what is my ip&quot; will show you your computers public
                  IP address to allow.
                </MuiAlert>
                <CodeBlockTabs
                  showLineNumbers
                  linux={`sudo systemctl start bee`}
                  mac={`brew services start swarm-bee`}
                />
                <li>Run the commands to validate your node is running and see the log output.</li>
                <CodeBlockTabs
                  showLineNumbers
                  linux={`sudo systemctl status bee \njournalctl --lines=100 --follow --unit bee`}
                  mac={`brew services list \ntail -f /usr/local/var/log/swarm-bee/bee.log`}
                />
                <li>
                  Lastly, check your nodes configuration settings to validate the debug API is enabled and the Cross
                  Origin Resource Sharing (CORS) setting is configured to allow your host. Config parameter{' '}
                  <strong>debug-api-enable</strong> must be set to <strong>true</strong> and{' '}
                  <strong>cors-allowed-origins</strong> must be set to your host domain or IP (you can also use the
                  wildcard <code>{"cors-allowed-origins: ['*']"}</code>). If edits are made to the configuration run the
                  restart command below for changes to take effect.
                </li>
                <CodeBlockTabs
                  showLineNumbers
                  linux={`sudo vi /etc/bee/bee.yaml\nsudo systemctl restart bee`}
                  mac={`sudo vi /usr/local/etc/swarm-bee/bee.yaml \nbrew services restart swarm-bee`}
                />
              </ol>
            }
          />
        </ExpandableList>
      )}
    </ExpandableList>
  )
}
