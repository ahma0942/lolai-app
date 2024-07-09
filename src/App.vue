<template>
	<v-app>
		<v-main>
			<v-toolbar class="mb-15">
				<v-toolbar-title>LOL AI</v-toolbar-title>
				<v-spacer />
				<v-btn to="/">Home</v-btn>
				<v-btn to="/matchups">Matchups</v-btn>
			</v-toolbar>
			<router-view />
      <Notifications style="transform: scale(2) translateX(-25%) translateY(-25%);" :duration=15 position="bottom right" />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { Notifications } from '@kyvg/vue3-notification';
import { Component, Vue } from 'vue-facing-decorator';

@Component({
  components: {
    Notifications,
  },
})
export default class App extends Vue {}
</script>

