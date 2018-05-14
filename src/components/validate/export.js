import uploadFields from './uploadFields'
import { mapState } from "vuex";
export default {
    data() {
        let contactNoValid = (rule, value, callback) => {
            !!value.replace(/\s+/g, "") ||
                callback(new Error("公司联系电话不能为空"));
            if (!/^0\d{2,3}-\d{5,9}$/.test(value)) {
                callback(new Error("格式不正确"));
            } else {
                callback();
            }
        };
        let mobileValid = (rule, value, callback) => {
            !!value.replace(/\s+/g, "") || callback(new Error("手机号不能为空"));
            if (/^1\d{10}$/.test(value)) {
                callback();
            } else {
                callback(new Error("格式不正确"));
            }
        };
        let idCardNoValid = (rule, value, callback) => {
            !!value.replace(/\s+/g, "") || callback(new Error("身份证不能为空"));
            if (
                /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
                    value
                )
            ) {
                callback();
            } else {
                callback(new Error("身份证格式不正确"));
            }
        };
        return {
            id: null,
            imgUrl: new Object(),
            gallery: false,
            formItem: {
                name: "",
                permitNo: "",
                businessScope: "",
                email: "",
                businessEntity: "",
                address: "",
                permitAddress: "",
                contactNo: "",
                orgNo: "",
                mobile: "",
                idCardNo: "",
                summary: "",
                userId: sessionStorage.getItem("user_id")
            },
            uploadItems: uploadFields,
            formValidate: {
                contactNo: [{ validator: contactNoValid, trigger: "blur" }],
                mobile: [{ validator: mobileValid, trigger: "blur" }],
                idCardNo: [{ validator: idCardNoValid, trigger: "blur" }],
                email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }]
            },
            ruleValidate: {
                name: [{ required: true, trigger: "change", message: "未上传" }]
            },
            buttonTitle: ["", "重新提交", "提交存管实名", "立即绑卡"]
        };
    },
    metaInfo: {
        title: "我的企业资料"
    },
    props: ['status'],
    computed: {
        buttonInfo() {
            return this.buttonTitle[this.status];
        },
        ...mapState({
            isLoading: state => state.buttonLoading.isLoading
        })
    },
    methods: {
        upLoad(e) {
            let ele = e.srcElement || e.target; // fix firefox bug
            if (!ele.value) return;
            if (!/(\.jpe?g)|(\.png)|(\.bmp)$/gi.test(ele.value)) {
                this.$Message.error("上传的图片格式不正确，请重新选择！");
                return;
            }
            if ((ele.files[0].size / 1024).toFixed(0) > 2048) {
                this.$Message.error("图片过大，请上传小于2M的图片！");
                return;
            }

            let fd = new FormData(),
                parent = this.$refs[ele.name][0].$el;
            // should be the better code but I have no idea at the moment

            this.id && fd.append("id", this.id);
            fd.append("file", ele.files[0]);
            fd.append("type", ele.name);
            fd.append("userId", sessionStorage.getItem("user_id"));
            this.$http
                .post("borrowMoney/save/enterpriseInfo/uploadFile", fd)
                .then(({ model }) => {
                    this.id = model.id;
                    this.imgUrl[ele.name] = model[ele.name];
                    this.$Message.success("上传成功");
                    parent.querySelector(".file-status").textContent = ele.files[0].name;
                    parent.querySelector(".file-status").classList.add("already");
                    parent.querySelector(".file-btn span").textContent = "重新上传";
                    return Promise.reject(); //release input file
                })
                .catch(err => (ele.value = null));
        },
        showGallery(who) {
            if (this.imgUrl[who]) {
                this.gallery = !this.gallery;
                let img = this.imgUrl[who];
                let dom = document.getElementById("gallery-show");
                dom.style.background = `url(${img}) no-repeat center `;
                dom.style.backgroundSize = "100% 100%";
            }
        },
        commit(form, isUpload = false) {
            this.$refs[form].validate(valid => {
                if (!valid) return;
                if (!(valid && Object.values(this.formItem).every(_ => !!_))) {
                    this.$Message.warning("请填写完整");
                    return;
                }
                if (!isUpload &&
                    valid &&
                    Object.values(this.formItem).every(_ => !!_)
                ) {
                    let len = this.$refs["formValidate"].fields.length;
                    isUpload =
                        len <=
                        this.$refs["formValidate"].$el.querySelectorAll(".already").length;
                }

                isUpload
                    ?
                    this.$http
                    .post(
                        "borrowMoney/save/enterpriseInfo",
                        Object.assign(this.formItem, this.id ? { id: this.id } : {})
                    )
                    .then(({ model }) => {
                        sessionStorage.setItem("status", 1);
                        this.$Message.success({
                            content: "资料保存成功！",
                            onClose: () => {
                                this.$router.go(0);
                            }
                        });
                    })
                    .catch(({ msg }) => this.$Message.error(msg)) :
                    this.$Message.warning("请完整上传图片");
            });
        },
        submit(form) {
            (this.status === 1 || this.status < 0) && this.commit(form, true);
            this.status === 2 &&
                this.$mine("deposit/openAccount", {
                    realName: this.formItem.name,
                    idCardType: "CREDIT_ID",
                    bankLicense: this.formItem.orgNo
                })
                .then(({ model }) => {
                    this.$Modal.success({
                        content: "恭喜，存管实名成功！",
                        onOk: () => {
                            this.$router.push("/enterpriseAuth/openAccount");
                        }
                    });
                })
                .catch(({ msg }) => this.$Message.error(msg));
            this.status === 3 && this.$router.push("/enterpriseAuth/openAccount");
        }
    },
    created() {
        this.status === 0 ||
            this.$mine("borrowMoney/selectEnterpriseInfo").then(({ model }) => {
                Object.keys(model).forEach(item => {
                    if (this.formItem.hasOwnProperty(item))
                        this.formItem[item] = model[item];
                    this.uploadItems.forEach(every => {
                        if (every.hasOwnProperty(item)) {
                            every[item] = model[item];
                            this.imgUrl[item] = model[item];
                        }
                    });
                });
            });
        this.status === 3 &&
            this.$mine("deposit/selectApplyCardByUserId")
            .then(() => {
                this.buttonTitle.splice(3, 1, "绑卡审核中");
            })
            .catch(({ msg }) => console.log(msg));
    }
};