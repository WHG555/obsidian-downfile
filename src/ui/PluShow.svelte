<script lang="typescript">
    import PluHelp from "./PluHelp.svelte"
    import {GetGiteePluginHistory, GetGiteePluginList,GetFileFromGitee} from '../downloadfile.ts'
    // import {GetNowPlugin} from './getdata'
    import {FileSystemAdapter, Vault, App, Notice } from 'obsidian';
    export let name:string;
    export let plulist;
    export let pluhistory;
    export let nowpluinfo; // 当前安装的插件
    export let bashpath;
    let showtext = "test"
    let nowplugin:JSON    // 现在点击的插件
    let nowpluhis = []
    let selectedIndex = -1
    let pluname = '';
    

    // <!--更改右边的内容-->
    async function changeText(tts) {
        // console.log(tts)
        nowplugin = tts
        // showtext = ts['description']

        showtext = 'downloads ' 
        showtext += '---'
        showtext += pluhistory[nowplugin['id']]['downloads']

        nowpluhis = []
        Object.keys(pluhistory[nowplugin['id']]).forEach(key => {
            // console.log(key, pluhistory[nowplugin][key]);
            nowpluhis.push(key)
        });
        
        // 设置版本号
        selectedIndex = -1
        for (let pl of nowpluinfo) {
            if (pl['id'] == nowplugin['id']) {
                for (let i in nowpluhis) {
                    if (nowpluhis[i] == pl['version']) {
                        selectedIndex = i
                    }
                }
            }
        }

        // console.log("test",  await getNowPlugin())
    }

    async function install_plugin() {
        // console.log('sel num', selectedIndex)
        // console.log(nowplugin)
        // console.log(nowpluhis[selectedIndex])
// 
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\plugins\\' + nowplugin['id']
        // 创建插件目录
        filesys.mkdir(plupath)

        let sdata0 = GetFileFromGitee(nowplugin['gitee'].split('.git')[0], nowplugin['repo'].split('/')[1], nowpluhis[selectedIndex], 'manifest.json')
        filesys.write(plupath + "/manifest.json", (await sdata0))

        let sdata1 = GetFileFromGitee(nowplugin['gitee'].split('.git')[0], nowplugin['repo'].split('/')[1], nowpluhis[selectedIndex], 'manifest.json')
        filesys.write(plupath + "/main.js", (await sdata1))

        let sdata2 = GetFileFromGitee(nowplugin['gitee'].split('.git')[0], nowplugin['repo'].split('/')[1], nowpluhis[selectedIndex], 'manifest.json')
        filesys.write(plupath + "/styles.css", (await sdata2))

        await getNowPlugin();
    }
    function update_plugin () {

    }
    async function delete_plugin () {
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\plugins\\' + nowplugin['id']
        // 创建插件目录
        filesys.rmdir(plupath, true)
        new Notice(nowplugin['name'] + 'Delete Success');
        
        await getNowPlugin();
    }

        // 值改变后的函数
    function remindMeLater() {
        // console.log(selectedIndex)
    }
    // 获取当前安装插件的信息
    async function getNowPlugin() {
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')

        let configdir = valut
        let libpath = (await filesys.list(bashpath + '\\' + valut.configDir + '\\plugins')).folders
        let thisplulist = []
        for (let i in libpath) {
            // 获取所有插件版本信息
            // 判断文件是否存在
            if (await filesys.exists(libpath[i] + '\\manifest.json', true)) {
                let filedata = (await filesys.read(libpath[i] + '\\manifest.json'));
                let tmp = JSON.parse(filedata);
                thisplulist.push(tmp)
            }
            
        }	
        nowpluinfo = thisplulist
        return thisplulist
    }
    
    async function getPlu() {
        
    }

</script>
      


<!-- <main> -->
<div class="community-plugin">
    <!--左边界面-->
    <div class="community-plugin-search">
        
        <h1>插件管理</h1>
        <!--1、搜索框-->
        <div>
            <input type=text placeholder='搜索插件' bind:value={pluname} />

        </div>

        <!--2、插件总数-->
        <div class="community-plugin-search-summary"> 当前一共{plulist.length}个插件</div>
        <!--3、搜索结果-->
        <div class="community-plugin-search-results"> 
            
            {#each plulist as plugin_info}
                <!-- 优化搜索结果 -->
                {#if pluname}
                    {#if plugin_info['name'].includes(pluname)}
                        <div class="community-plugin-item" on:click={changeText(plugin_info)}>
                            <div class="community-plugin-name"> 
                                {plugin_info['name']}
                            
                                {#each nowpluinfo as nowplu}
                                    {#if nowplu['id'].includes(plugin_info['id'])}
                                        <span style="color:aqua; background:gold">已安装</span>
                                    {/if}
                                {/each}
                            </div>
                            
                            <div>{pluhistory[plugin_info['id']]['downloads']}</div>
                            <div>作者：{plugin_info['author']}</div>
                            <div> {plugin_info['description']} </div>
                        </div>
                    {/if}
                {:else}
                    <div class="community-plugin-item" on:click={changeText(plugin_info)}>
                        <div class="community-plugin-name"> 
                            {plugin_info['name']}
                        
                            {#each nowpluinfo as nowplu}
                                {#if nowplu['id'].includes(plugin_info['id'])}
                                    <span style="color:aqua; background:gold">已安装</span>
                                {/if}
                            {/each}
                        </div>
                        
                        <div>{pluhistory[plugin_info['id']]['downloads']}</div>
                        <div>作者：{plugin_info['author']}</div>
                        <div> {plugin_info['description']} </div>
                    </div>
                {/if}

                
                
            {/each}
        </div>
        
        
        
    </div>

    <!-- 右边界面 -->
    <div class="community-plugin-details" id="show">

        <!-- {showtext} -->
        <!-- <PluHelp pluname={nowplugin} pludownlist={nowpluhis} pluinfo={plulist} mkdirpath={mkdirpath} writefile={writefile} bashpath={bashpath} selectedIndex={selectedIndex}/> -->
        {#if nowplugin}
            <h2>{nowplugin['name']}</h2>
            <div>作者：{nowplugin['author']}</div>
            <div>{nowplugin['description']}</div>

            <!-- 版本信息 -->
            <div>
                <select
                    name="version"
                    bind:value={selectedIndex}
                    on:change={remindMeLater}
                >
                    {#each nowpluhis as li, i}
            
                        <!-- <option value={i}>{li} {i} {selectedIndex} </option> -->
                        {#if li != 'downloads'}
                            {#if Number(i) == Number(selectedIndex)}
                                <option style="background-color: cyan;" value={i}>{li}</option>
                            {:else}
                                <option value={i}>{li}</option>
                            {/if}
                        {/if}
            
                    {/each}
        
                </select>
                <span>
                    {#each nowpluinfo as nowplu}
                        {#if nowplu['id'].includes(nowplugin['id'])}
                            <span>当前版本：{nowplu['version']}</span>
                        {/if}
                    {/each}
                </span>
            </div>

            <div>
                <button on:click={install_plugin}>安装</button>
                <!-- <button on:click={update_plugin}>更新</button> -->
                <button on:click={delete_plugin}>卸载</button>
            </div>


        {:else}
            <p>选择一个插件进行查看与安装</p>
        {/if}
    </div>

</div>
<!-- </main> -->
      
<style>
.community-plugin-item .community-plugin-author {
    font-size: 14px;
}
.community-plugin-version, .community-plugin-author {
    line-height: 26px;
}
.community-plugin-downloads {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 3px;
    display: inline-block;
}
.community-plugin-item {
    margin: 15px 0;
    padding: 10px 20px 15px 20px;
    cursor: pointer;
}
.community-plugin-search-results {
    overflow: scroll;
}
.community-plugin-search-summary {
    font-size: 15px;
    padding: 0 20px 6px 20px;
}
.plugin-name {
    font-size: 1.5em;
}
.vertical-tabs-container {
    display: flex;
}
.group-name {
    font-size: 14px;
    color: var(--text-muted);
    border-bottom: 1px solid var(--text-muted);
    margin-bottom: 0.5rem;
}
.set_color {
    color: aqua;
    background-color: fuchsia;
}
.set_color2 {
    color:blue;
    background-color: gold;
}
.community-plugin {
    /* display: flex;
    flex-direction: row; */
    margin: 0;
    height: 100%;
}
.modal-content {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    overflow: auto;
}
.community-plugin-search {
    flex: 3 0 100px;
    flex-grow: 3;
    flex-shrink: 0;
    flex-basis: 100px;
    background-color: var(--background-secondary-alt);
    padding: 40px 0 0 0;
    display: flex;
    flex-direction: column;
}

.community-plugin-details {
    flex: 10 0 0;
    overflow: scroll;
    display: flex;
    flex-direction: column;
}
</style>