<script lang="typescript">
    import {FileSystemAdapter, Vault, App, Notice } from 'obsidian';
    import {GetGiteePluginHistory, GetGiteePluginList,GetThemeFromGitee} from '../downloadfile.ts'
    export let themelist;
    export let nowthemelist;
    export let name;
    export let bashpath;

    async function install_plugin(name, path) {
        // console.log(name)
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\themes'
        // 创建插件目录
        filesys.mkdir(plupath)
        
        for (let i in themelist) {
            if (name == themelist[i]['name']) {
                let sdata0 = GetThemeFromGitee(themelist[i]['gitee'], themelist[i]['repo'].split('/')[1], name + '.css')
                filesys.write(plupath + "/" + name + ".css", (await sdata0))
            }
        }     
        
        await getNowTheme();
    }

    async function delete_theme(name) {
        // console.log(name)
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\themes\\' + name + '.css'
        filesys.remove(plupath)

        await getNowTheme();
    }

    async function getNowTheme() {
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')

        let configdir = valut
        let libpath = (await filesys.list(bashpath + '\\' + valut.configDir + '\\themes')).files

        nowthemelist = libpath
        // console.log(nowthemelist)
    }

</script>

<div>
    <!-- 上半部分 -->
    <div>
        <h2 class="text-class"> 已经安装主题</h2>
        <div class='theme-list'>
            {#each nowthemelist as nthe}
            <!-- <p>{nthe.split('/')[nthe.split('/').length - 1]}</p> -->
            {#each themelist as the}
                {#if nthe.split('/')[nthe.split('/').length - 1].includes(the['name'])}
                    <div class="community-theme">
                        <div class="community-theme-title">{the['name']}</div>
                        <img class="community-theme-screenshot" src=https://gitee.com/whghcyx/obsidian-theme/raw/master/{the["repo"].split('/')[1]}/themeshow.{the["screenshot"].split(".")[the["screenshot"].split(".").length - 1]} />
                        <div class="modal-button-container">
                            <button class="mod-cta" on:click={delete_theme(the['name'], the['repo'].split('/')[1])} name={the['name']}>删除</button>
                        </div>
                    </div>
                {/if}
            {/each}
        {/each}
        </div>
        



    </div>
    <!-- 下半部分 -->
    <div>
        <h2 class="text-class"> 社区主题</h2>

        <!-- 显示结果 -->
        <div class='theme-list'>
            {#each themelist as the}
                <div class="community-theme">
                    <div class="community-theme-title">{the['name']}</div>
                    <img class="community-theme-screenshot" src=https://gitee.com/whghcyx/obsidian-theme/raw/master/{the["repo"].split('/')[1]}/themeshow.{the["screenshot"].split(".")[the["screenshot"].split(".").length - 1]} />
                    <div class="modal-button-container">
                        <button class="mod-cta" on:click={install_plugin(the['name'], the['repo'].split('/')[1])} name={the['name']}>使用</button>
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
