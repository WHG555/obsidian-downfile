<script lang="typescript">
    import { select_value } from "svelte/internal";
    import {GetFileFromGitee} from "../downloadfile"
    import {FileSystemAdapter, Vault, App, Notice } from 'obsidian';

    export let pluname:string;
    export let pludownlist:JSON;
    export let pluinfo;
    export let bashpath;
    export let selectedIndex:number;

    async function install_plugin() {
        console.log('sel num', selectedIndex)
        console.log('plu name', pluname)
        for (let i of pluinfo) {
            if (i['id'] == pluname) {
                console.log(i['gitee'].split('.git'))
                console.log(pludownlist[selectedIndex])

                let valut = new Vault()
                let filesys = new FileSystemAdapter('.')
                // 创建插件目录 
                let plupath = bashpath + '\\' + valut.configDir + '\\plugins\\' + pluname
                // 创建插件目录
                filesys.mkdir(plupath)
                // filef.mkdir(plupath)

                let sdata0 = GetFileFromGitee(i['gitee'].split('.git')[0], i['repo'].split('/')[1], pludownlist[selectedIndex], 'manifest.json')
                if (await sdata0) {
                    console.log('helpapp', sdata0)
                    filesys.write(plupath + "/manifest.json", (await sdata0))
                }
                

                let sdata1 = GetFileFromGitee(i['gitee'].split('.git')[0], i['repo'].split('/')[1], pludownlist[selectedIndex], 'main.js')
                if (await sdata1) {
                    console.log('helpapp', sdata1)
                    filesys.write(plupath + "/main.js", (await sdata1))
                }
                

                let sdata2 = GetFileFromGitee(i['gitee'].split('.git')[0], i['repo'].split('/')[1], pludownlist[selectedIndex], 'styles.css')
                if (await sdata2) {
                    console.log('helpapp', sdata2)
                    filesys.write(plupath + "/styles.css", (await sdata2))
                }
                
                console.log('helpapp1', sdata0)
                console.log('helpapp2', sdata1)
                console.log('helpapp3', sdata2)
                new Notice(pluname + 'Download success');
            }
        }
    }
    function update_plugin () {

    }
    function delete_plugin () {
        let valut = new Vault()
        let filesys = new FileSystemAdapter('.')
        // 创建插件目录 
        let plupath = bashpath + '\\' + valut.configDir + '\\plugins\\' + pluname
        // 创建插件目录
        filesys.rmdir(plupath, true)
        new Notice(pluname + 'Delete Success');
    }
    // 值改变后的函数
    function remindMeLater() {
        console.log(selectedIndex)
    }
</script>

<h1 style="centor"> {pluname} </h1>
{#each pluinfo as li}

    {#if li['id'] == pluname}
        {#if selectedIndex != -1}
            <p>当前版本：{pludownlist[selectedIndex]}</p>
        {/if}
        
    {/if}
{/each}
<div>
    <select
        name="version"
        bind:value={selectedIndex}
        on:change={remindMeLater}
        
    >
        {#each pludownlist as li, i}

            <!-- <option value={i}>{li} {i} {selectedIndex} </option> -->
            {#if li != 'downloads'}
                {#if Number(i) == Number(selectedIndex)}
                    <option style="background-color: cyan;" value={i}>{li}</option>
                {:else}
                    <option value={i}>{li}</option>
                {/if}
            {/if}

        {/each}

        <!-- <option value=0>Volvo</option>
        <option value=1>Saab</option>
        <option value=2>Mercedes</option>
        <option value=3>Audi</option>  -->
    </select>

    <!-- {#each pludownlist as li, i}
        {#if li != 'downloads'}
            <button>{li}</button>
        {/if}

    {/each} -->
    <button on:click={install_plugin}>安装</button>
    <button on:click={update_plugin}>更新</button>
    <button on:click={delete_plugin}>卸载</button>
</div>
