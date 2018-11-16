var chinese_language_env = {
    remove_forbid:'删除过滤',
    add_forbid: '添加过滤',
    click_to_remove:'点击去除',
    forbid_url:'输入需要过滤的url',
    popup_title:'添加url过滤',
    check_remove_all:'确认删除所有过滤？',
    remove_all:'清空过滤规则',
    done_add_forbid:'添加成功',
    save:'过滤库另存为',
    load:'切换过滤库(清空当前过滤规则)',
    db_title:'输入库名',
    current_db:'当前过滤库',
    readme:'提示',
    db:'过滤库',
    remove_db:'删除过滤库',
    list_dbs:'过滤库列表',
    dbs_clean:'删除所有过滤库',
    check_dbs_clean:'确认删除所有过滤库？'
}
var english_language_env = {
    remove_forbid:'remove forbid',
    add_forbid: 'add forbid',
    click_to_remove:'click to remove',
    forbid_url:'input url to forbid',
    popup_title:'add url forbid',
    check_remove_all:'sure to remove all forbids?',
    remove_all:'clean forbid urls',
    done_add_forbid:' successful to be added to forbids'
}

function empty(url){
    return (!url)||(url==null)||(url=='')||(url==null)||(url=='null')
}
var language_env = chinese_language_env;
//var urls = ["*://*.baidu.com/it/u=*&fm=*","https://cpro.baidustatic.com/*","https://cpro2.baidustatic.com/*","https://hm.baidu.com/hm.js","*://rabc2.iteye.com/*","*://show-f.mediav.com/*","*://show-f.mediav.com"];
var forbids = {};
var clicks = {};
var forbids_urls = [];
var default_save_key = 'forbids';
var save_key = default_save_key;
var dbs = {}
dbs[save_key] = 'curr';
function dbs_save(){
    mp={}
    mp['null'] = dbs
    chrome.storage.sync.set(mp);
}
function dbs_clean(){
    dbs = {}
    save_key = default_save_key
    dbs[save_key] = 'curr';
    dbs_save()
}
function dbs_load(){
    mp={}
    mp['null'] = dbs
    chrome.storage.sync.get(mp,function(item){
        var tmps = item['null'];
        dbs = tmps;
        dbs_list().forEach(function(key,i){
            if(dbs[key] == 'curr'){
                save_key = key;
            }
        })
        update_db_menu();
    });
}
dbs_load();
function dbs_list(){
    return Object.keys(dbs);
}
function dbs_remove(db){
    if (!dbs[db]){
        return;
    }
    delete dbs[db];
    dbs_save();
}
function dbs_change(db){
    dbs[save_key]='save';
    dbs[db]='curr';
    save_key = db;
    dbs_save();
}

var create_id = chrome.contextMenus.create({
    title: language_env.add_forbid,
    contexts:['all'],
    onclick: function(clickData){
        var default_url = null
        default_url = default_url||clickData.linkUrl
        default_url = default_url||clickData.srcUrl 
        default_url = default_url||clickData.pageUrl
        var url = prompt(language_env.forbid_url,default_url);
        add(url);
    }
});
var remove_id = chrome.contextMenus.create({
    title: language_env.remove_forbid,
    contexts:['all'],
    enabled:false
});
function clean_forbids(save){
    if (save){
        mp = {}
        mp[save_key] = []
        chrome.storage.sync.set(mp);
    }
    urls = Object.keys(clicks);
    urls.forEach(function(url, i){
        remove_forbid(url, false);
    });
}
var remove_all_id = chrome.contextMenus.create({
    title: language_env.remove_all,
    contexts:['all'],
    onclick: function(){
        var checked = confirm(language_env.check_remove_all);
        if(checked){
            clean_forbids(true);
        }
    }
});

var db_menu_id = chrome.contextMenus.create({
    title: language_env.db,
    contexts:['all']
});
var db_id = chrome.contextMenus.create({
    title: language_env.current_db+": "+save_key,
    contexts:['all'],
    parentId:db_menu_id,
    enabled:false 
});
var save_id = chrome.contextMenus.create({
    title: language_env.save,
    contexts:['all'],
    onclick: function(){
        var default_key = save_key;
        var name = prompt(language_env.db_title,default_key);
        if (empty(name)){
            return;
        } else{
            save_forbids(name);
            dbs_change(name);
            update_db_menu();
        }
    },
    parentId:db_menu_id
});
var load_id = chrome.contextMenus.create({
    title: language_env.load,
    contexts:['all'],
    onclick: function(){
        var default_key = save_key;
        var name = prompt(language_env.db_title,default_key);
        if (empty(name)){
            return;
        } else{
            clean_forbids(false);
            loads(name);
            dbs_change(name);
            update_db_menu();
        }
    },
    parentId:db_menu_id
});
var remove_db_id = chrome.contextMenus.create({
    title: language_env.remove_db,
    contexts:['all'],
    onclick: function(){
        var default_key = save_key;
        var name = prompt(language_env.db_title,default_key);
        if (empty(name)){
            return;
        } else{
            dbs_remove(name);
            update_db_menu();
        }
    },
    parentId:db_menu_id
});
var list_dbs_id = chrome.contextMenus.create({
    title: language_env.list_dbs,
    contexts:['all'],
    onclick: function(){
        var s = dbs_list().join(" ");
        //prompt(save_key,s);
        //confirm(s);
        alert(s);
        //prompt(save_key, s);
    },
    parentId:db_menu_id
});
var clean_dbs_id = chrome.contextMenus.create({
    title: language_env.dbs_clean,
    contexts:['all'],
    onclick: function(){
        
        var checked = confirm(language_env.check_dbs_clean);
        if(checked){
            dbs_clean();
        }
    },
    parentId:db_menu_id
});
var readme_id = chrome.contextMenus.create({
    title: language_env.readme,
    contexts:['all'],
    onclick: function(){
        var s = "所有的添加，删除，清空操作会都会自动保存。\n过滤库中，默认过滤库'"+default_save_key+"'无法被删除，指定将其删除也只是进行清空操作，此外，'null'作为保留关键字无法作为过滤库名被使用\n"+"删除过滤库时，若删除的为当前过滤库，需要及时切换到其它过滤库去，否则进行修改后，会再次自动保存"
        alert(s);
    }
});
function update_db_menu(){
    chrome.contextMenus.update(db_id,{
        title: language_env.current_db+": "+save_key,
        contexts:['all']
    });
}
function add(url){
    if(!url){
        return;
    }
    forbid(url, true);
}
function loads(key){
    key = key||save_key
    mp={}
    mp[key]=[]
    chrome.storage.sync.get(mp, function(item){
        forbids_urls = item[key];
        load(forbids_urls);
    });
}
loads();
function load(tforbids_urls){
    tforbids_urls.forEach(function(url, i){
        forbid(url, false);
    });
}

function save_forbids(key) {
    key = key||save_key
    urls = Object.keys(forbids);
    mp = {}
    mp[key] = urls
    chrome.storage.sync.set(mp);
}
function remove_forbid(url, save){
    if(!clicks[url]){
        return;
    }
    var id = clicks[url];
    chrome.contextMenus.remove(id);
    delete forbids[url];
    delete clicks[url];
    if (Object.keys(clicks).length==0){
        chrome.contextMenus.update(remove_id,{
            enabled:false
        });
    }
    if(save){
        save_forbids();
    }
}
function add_menu(url){
    var turl = url;
    var id = chrome.contextMenus.create({
        title: url,
        contexts:['all'],
        onclick: function(){
            remove_forbid(turl, true);
        },
        parentId :remove_id
    });
    chrome.contextMenus.update(remove_id,{
        enabled:true
    });
    
    return id;
}
function check_forbid(src_url){
    var mask = false;
    Object.keys(forbids).forEach(function(url, i){
        match_url = forbids[url];
        var mh = src_url.search(match_url);
        if(mh != -1){
            mask = true;
        }
    });
    return mask;
}
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
        return {cancel:check_forbid(details.url)}; 
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);
function replace(url, s){
    s = "\\"+s;
    re = new RegExp(s,'g');
    return url.replace(re, s);
}
function replaces(url, ss){
    
    ss.split('').forEach(function(s, i){
        url = replace(url, s)
    });
    return url;
}
function forbid(url, save){
    if (forbids[url]){
        return;
    }
    var src_url = url;
    url = replaces(url, "\\`~!@#$%^&()_+-=[]{};:'\",.<>/?|");
    url = url.replace(/\*/g,'.*');
    match_url = new RegExp(url);
    
    forbids[src_url]=match_url;
    clicks[src_url] = add_menu(src_url);
    if(save){
        save_forbids();
    }
}
