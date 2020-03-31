import SockJS from '@/lib/sockjs'
import  '@/lib/stomp'

const state = {
  stomp: null,
  msgList: [],
  currentFriend: {},
  isDotMap: new Map(),
  nfDot: false
}

const mutations = {
  updateMsgList(state, newMsgList){
    state.msgList = newMsgList;
  },
  updateCurrentFriend(state, newFriend){
    state.currentFriend = newFriend;
  },
  addValue2DotMap(state, key){
    state.isDotMap.set(key, "您有未读消息")
  },
  removeValueDotMap(state, key){
    state.isDotMap.delete(key);
  },
  toggleNFDot(state, newValue){
    state.nfDot = newValue;
  },
}
const actions = {
  content({state,commit}) {

    state.stomp = Stomp.over(new SockJS(`http://localhost:9999/r/ws/endpointChat?access_token=${this.getters.token}`))
    state.stomp.connect({}, frame=> {
      state.stomp.subscribe('/user/queue/chat', message=> {
        var msg = JSON.parse(message.body);
        var key = this.getters.username + '#' + msg.from
        var oldMsg = window.localStorage.getItem(key);
        if (oldMsg == null) {
          oldMsg = [];
          oldMsg.push(msg);
          window.localStorage.setItem(key, JSON.stringify(oldMsg))
        } else {
          var oldMsgJson = JSON.parse(oldMsg);
          oldMsgJson.push(msg);
          window.localStorage.setItem(key, JSON.stringify(oldMsgJson))
        }
        if (msg.from != state.currentFriend.username) {
          commit('addValue2DotMap', 'isDot#' + this.getters.username + '#' + msg.from)
        }
        //更新msgList
        var oldMsg2 = window.localStorage.getItem(this.getters.username + '#' + state.currentFriend.username)
        if (oldMsg2 == null) {
          commit('updateMsgList', []);
        } else {
          commit('updateMsgList', JSON.parse(oldMsg2))
        }
        commit('toggleNFDot', true)
      });
      state.stomp.subscribe("/topic/nf", message=> {
        commit('toggleNFDot', true)
      })
    }, failedMsg=> {
      console.warn(failedMsg)
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
