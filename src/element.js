import Vue from 'vue'
import { MessageBox,Message,Image } from 'element-ui'


Vue.use(Image);
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message

