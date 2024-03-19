import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { getAgentPort } from '../utils/helpers';
import { ProxyDataTypes, ProxyImportDataTypes } from '../types/proxy';
import {BrowserProfileDataTypes, BrowserProfileTransformedDataTypes} from '../types/browserProfiles';

const browserRunUrl = process.env.REACT_APP_BROWSER_RUN_URL;
const agentPort = getAgentPort();

export default class AgentApi {
    static async sendToken() {
        const accessToken = await getAccessToken();
        const remoteApiToken = JSON.parse(localStorage.getItem('brovisorToken') || '');

        return axios.post(
            `${ browserRunUrl }:${ agentPort }/v1/remote-api-token`,
            {remoteApiToken: remoteApiToken},
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + accessToken,
                }
            }
        );
    };

    static async deleteToken() {
        const accessToken = await getAccessToken();
        const remoteApiToken = JSON.parse(localStorage.getItem('brovisorToken') || '');

        return axios.delete(
            `${ browserRunUrl }:${ agentPort }/v1/remote-api-token`,
            {
                data: {
                    remoteApiToken: remoteApiToken,
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            },
        );
    };

    static async checkSshProxyConnection( proxy: ProxyDataTypes | ProxyImportDataTypes) {
        const accessToken = await getAccessToken();
        let query = `${ proxy.id ? `?id=${ proxy.id }` : '' }`;

        return axios.post(
            `${ browserRunUrl }:${ agentPort }/v1/proxy/check${query}`,
            { body: proxy },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
    };

    static async exportCookies(browserProfiles: BrowserProfileTransformedDataTypes[]) {
        const accessToken = await getAccessToken();
        console.log('browserProfile9988', browserProfiles)

        return axios.post(
            `${ browserRunUrl }:${ agentPort }/v1/export-cookies`,
            {
                data: browserProfiles
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                    responseType: 'blob',
                },
            }
        );
    };

    // [
    //    {
    //      id: 'erger',
    //      cookies: '[{},{}]'
    //    }
    // ]
    static async importCookies(browserProfileId: string, cookies: string | ArrayBuffer | null) {
        const accessToken = await getAccessToken();

        return axios.post(
            `${ browserRunUrl }:${ agentPort }/v1/cookies/${browserProfileId}/import`,
            {cookies: cookies},
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                    responseType: 'blob',
                },
            }
        );
    };
}
