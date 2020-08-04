<template>
  <div>
    <v-card
      flat
      class="ma-3 mt-10"
      v-for="message in messages"
      :key="message.id"
    >
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <p class="title">
              Sõnum kasutajalt: {{ message.senderName }} {{ message.sended_at }}
            </p>
          </v-col>
          <v-col cols="12">
            <p>kasutajale: {{ message.receiverName }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p style="color: black">
              {{ message.content }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array
    }
  }
};
</script>

<style lang="scss" scoped></style>
