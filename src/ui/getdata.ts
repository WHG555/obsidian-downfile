import { GetGiteePluginHistory } from 'downloadfile';
import {FileSystemAdapter, Vault, App, Notice } from 'obsidian';

export const GetNowPlugin = async(): Promise<any> => {
    let filesys = new FileSystemAdapter('.')

    let configdir = ".obsdian"
    let libpath = (await filesys.list(configdir + '//plugins')).folders
    let thisplulist = []
    for (let i in libpath) {
        // 获取所有插件版本信息
        let filedata = (await filesys.read(libpath[i] + '\\manifest.json'));
        let tmp = JSON.parse(filedata);
        thisplulist.push(tmp)
    }	
    return thisplulist
}