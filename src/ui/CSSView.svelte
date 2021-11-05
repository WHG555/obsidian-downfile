<script lang="typescript">
    import {FileSystemAdapter, Vault, App, Notice } from 'obsidian';
    import {GetGiteePluginHistory, GetGiteePluginList,GetThemeFromGitee} from '../downloadfile.ts'
	export let name;
    export let snippetlist;
    export let nowsnilist;

    async function install_plugin(name, path) {
        // console.log(name)
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\themes'
        // 创建插件目录
        filesys.mkdir(plupath)
        
        for (let i in snippetlist) {
            if (name == themelist[i]['name']) {
                let sdata0 = GetThemeFromGitee(themelist[i]['gitee'], themelist[i]['repo'].split('/')[1], name + '.css')
                filesys.write(plupath + "/" + name + ".css", (await sdata0))
            }
        }     
        
        await getNowTheme();
        // console.log(tmp)
    }

    async function getNowTheme() {
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')

        let configdir = valut
        let libpath = (await filesys.list(bashpath + '\\' + valut.configDir + '\\snippets')).files

        nowsnilist = libpath
        // console.log(nowsnilist)
    }

</script>

<div>
    <!-- 上半部分 -->
    <div>
        <h2 class="text-class"> 已经安装CSS</h2>
        <div>
            {#each nowsnilist as nlist}
                <div>{nlist.split('/')[nlist.split('/').length - 1]}</div>
            {/each}
        </div>
    </div>
    <!-- 下半部分 -->
    <div>
        <h2 class="text-class"> 社区CSS样式</h2>
        <div class='theme-list'>
            {#each snippetlist as sni}
                <div class="community-theme">
                    <div class="community-theme-title">{sni['name']}</div>
                    <div>{sni['description']}</div>
                    <img class="community-theme-screenshot" src=https://gitee.com/whghcyx/obsidian-snippet/raw/master/{sni["repo"]}/{sni["screenshot"]} />
                    <div class="modal-button-container">
                        <button class="mod-cta" on:click={install_plugin(sni['name'], sni['repo'])} name={sni['name']}>使用</button>
                    </div>
                </div>
            {/each}
        </div>
        
    </div>
</div>

<style>
    .modal-button-container {
        margin-top: 30px;
        text-align: center;
    }
    .community-theme-screenshot {
        max-width: 200px;
        height: auto;
        cursor: pointer;
    }
    .text-class {
        text-align: center;
    }
    .community-theme-title {
        text-align: center;
        font-weight: bold;
    }
    button.mod-cta {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
    }
    .theme-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .community-theme {
        width: 50%;
        max-width: 260px;
        padding: 15px 10px;
        background: var(--background-secondary-alt);
        margin: 15px 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
    </style>
