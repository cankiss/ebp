<template>
    <div id="not-found"></div>
</template>
<script>
    export default {
      mounted(){
        let _script = document.createElement('script'),
            _dom = document.querySelector('#not-found');
            _script.setAttribute('src','//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js');
            _script.setAttribute('homePageUrl',`//${window.location.host}`);
            _script.setAttribute('homePageName','回到我的主页')
        this.$nextTick(()=>{
          _dom.appendChild(_script)
        })
      }
    }
</script>
<style>

</style>
