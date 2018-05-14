<template>
	<!-- 充值提现弹窗 -->
	<Modal :title="modalTital.tost" v-model="modal9" class-name="vertical-center-modal">
		<img src="~/assets/img/icon_bigwarning.png" v-if="modalTital.img">
		<img src="~/assets/img/icon_right02.png" v-else />
		<p v-html="modalTital.content"></p>
		<div slot="footer" class="default"><button @click="sureModal">{{ modalTital.btn }}</button></div>
	</Modal>
</template>
<script>
	export default {
		data() {
			return {
				modal9: false
			}
		},
		methods:{
			sureModal(){
				if(this.modalTital.img){
					this.$router.push("/recharge/rechargeSuccess")
				}else{
					this.$router.push("/mine/transrecord?columnsType=3")
				}
			}
		},
		props: ["modalTital"]
	}
</script>
<style>
	@import "../../../assets/css/mine.css";
</style>