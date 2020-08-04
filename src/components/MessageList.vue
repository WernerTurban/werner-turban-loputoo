<template>
  <v-container>
    <v-row no-gutters style="margin: 30px" v-if="sentMessages"
      ><h1>Minu saadetud sõnumid</h1></v-row
    >
    <v-row no-gutters style="margin: 30px" v-else
      ><h1>Mulle saadetud sõnumid</h1></v-row
    >
    <v-divider></v-divider>
    <div v-for="message in messages" :key="message.id">
      <router-link
        :to="{
          name: 'Message',
          params: { id: message._id }
        }"
      >
        <v-row class="ml-1" no-gutters>
          <v-col cols="6" sm="2" style="height: 40px">
            <p :class="`message ${message.seen}`" v-if="sentMessages">
              {{ message.receiverName }}
            </p>
            <p :class="`message ${message.seen}`" v-else>
              {{ message.senderName }}
            </p>
          </v-col>
          <v-col cols="6" sm="8">
            <p :class="`message ${message.seen}`">{{ message.header }}</p>
          </v-col>
          <v-col cols="12" sm="2"
            ><p :class="`message ${message.seen}`">
              {{ message.sended_at }}
            </p></v-col
          >
        </v-row>
      </router-link>
      <v-divider></v-divider>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array
    },
    sentMessages: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-width: 100%;
  margin-bottom: 400px;
}
p {
  margin-top: 15px;
  color: black;
}
.message.false {
  font-weight: 900;
}
.message.true {
  font-weight: normal;
}
</style>
