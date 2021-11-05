import { PluginManifest, request } from "obsidian";

export const GetThemeFromGitee = async (repository: string, pluname:string, fileName: string): Promise<string> => {
    const URL = `${repository}/raw/master/${pluname}/${fileName}`;
    console.log('url-->', URL)
    try {
        const download = await request({ url: URL });
        return ( ( download === "Not Found" || download === `{"error":"Not Found"}`) ? null : download);
    } catch (error) {
        console.log("error in grabReleaseFileFromRepository", URL,  error)
    }
}

export const GetFileFromGitee = async (repository: string, pluname:string, version: string, fileName: string): Promise<string> => {
    const URL = `${repository}/raw/master/${pluname}/${version}/${fileName}`;
    console.log('url-->', URL)
    try {
        const download = await request({ url: URL });
        return ( ( download === "Not Found" || download === `{"error":"Not Found"}`) ? null : download);
    } catch (error) {
        console.log("error in grabReleaseFileFromRepository", URL,  error)
    }
}

// export const grabCommmunityPluginList = async(): Promise<JSON> => {   
//     // const pluginListURL = `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugins.json`;
//     const pluginListURL = `https://hub.fastgit.org/obsidianmd/obsidian-releases/HEAD/community-plugins.json`;
//     try {
//         const response = await request({ url: pluginListURL });
//         // console.log("github", response)
//         return (response === "404: Not Found" ? null : await JSON.parse(response));
//     } catch (error) {
//         console.log("error in grabCommmunityPluginList", error)
//     }
// }

export const GetGiteePluginList = async(): Promise<JSON> => {
    const pluginListURL = "https://gitee.com/whghcyx/obsidian-download-manage/raw/master/plugin/plugin_download_url.json"
    try {
        const response = await request({ url: pluginListURL });
        // console.log("gitee", response)
        return (response === "404: Not Found" ? null : await JSON.parse(response));
    } catch (error) {
        console.log("error in grabCommmunityPluginList", error)
    }
}


export const GetGiteeThemeList = async(): Promise<JSON> => {
    const pluginListURL = "https://gitee.com/whghcyx/obsidian-download-manage/raw/master/theme/theme_download_url.json"
    try {
        const response = await request({ url: pluginListURL });
        // console.log("gitee", response)
        return (response === "404: Not Found" ? null : await JSON.parse(response));
    } catch (error) {
        console.log("error in grabCommmunityPluginList", error)
    }
}

export const GetGiteeSnippetList = async(): Promise<JSON> => {
    const pluginListURL = "https://gitee.com/whghcyx/obsidian-download-manage/raw/master/snippet/snippet_download_url.json"
    try {
        const response = await request({ url: pluginListURL });
        // console.log("gitee", response)
        return (response === "404: Not Found" ? null : await JSON.parse(response));
    } catch (error) {
        console.log("error in grabCommmunityPluginList", error)
    }
}

export const GetGiteePluginHistory = async(): Promise<JSON> => {
    const pluginListURL = "https://gitee.com/whghcyx/obsidian-download-manage/raw/master/plugin/plugin_history_version.json"
    try { 
        const response = await request({ url: pluginListURL });
        // console.log("gitee", response)
        return (response === "404: Not Found" ? null : await JSON.parse(response));
    } catch (error) {
        console.log("error in grabCommmunityPluginList", error)
    }
}
