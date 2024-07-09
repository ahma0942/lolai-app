<template>
	<v-sheet class="mx-auto" width="1200">
		<v-form @submit.prevent>
			<v-row>
				<v-col><h3>Blue Team</h3></v-col>
				<v-col><h3>Red Team</h3></v-col>
			</v-row>
			<v-row>
				<v-col><v-text-field v-model="Matchup.BLUE_TOP.IGN" label="IGN" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.BLUE_TOP.Champion" label="Top" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.RED_TOP.Champion" label="Top" /></v-col>
				<v-col><v-text-field v-model="Matchup.RED_TOP.IGN" label="IGN" /></v-col>
			</v-row>
			<v-row>
				<v-col><v-text-field v-model="Matchup.BLUE_JUNGLE.IGN" label="IGN" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.BLUE_JUNGLE.Champion" label="Jungle" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.RED_JUNGLE.Champion" label="Jungle" /></v-col>
				<v-col><v-text-field v-model="Matchup.RED_JUNGLE.IGN" label="IGN" /></v-col>
			</v-row>
			<v-row>
				<v-col><v-text-field v-model="Matchup.BLUE_MID.IGN" label="IGN" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.BLUE_MID.Champion" label="Mid" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.RED_MID.Champion" label="Mid" /></v-col>
				<v-col><v-text-field v-model="Matchup.RED_MID.IGN" label="IGN" /></v-col>
			</v-row>
			<v-row>
				<v-col><v-text-field v-model="Matchup.BLUE_ADC.IGN" label="IGN" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.BLUE_ADC.Champion" label="Adc" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.RED_ADC.Champion" label="Adc" /></v-col>
				<v-col><v-text-field v-model="Matchup.RED_ADC.IGN" label="IGN" /></v-col>
			</v-row>
			<v-row>
				<v-col><v-text-field v-model="Matchup.BLUE_SUPPORT.IGN" label="IGN" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.BLUE_SUPPORT.Champion" label="Support" /></v-col>
				<v-col><ChampionAutocomplete v-model="Matchup.RED_SUPPORT.Champion" label="Support" /></v-col>
				<v-col><v-text-field v-model="Matchup.RED_SUPPORT.IGN" label="IGN" /></v-col>
			</v-row>
			<v-btn class="mt-5 pa-10" @click="run()" block>Submit</v-btn>
		</v-form>
	</v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import ChampionAutocomplete from '@/components/ChampionAutocomplete.vue';

@Component({
	components: {
		ChampionAutocomplete,
	},
})
export default class Home extends Vue {
	Matchup: any = {
		BLUE_TOP: { Champion: null, IGN: null },
		BLUE_JUNGLE: { Champion: null, IGN: null },
		BLUE_MID: { Champion: null, IGN: null },
		BLUE_ADC: { Champion: null, IGN: null },
		BLUE_SUPPORT: { Champion: null, IGN: null },
		RED_TOP: { Champion: null, IGN: null },
		RED_JUNGLE: { Champion: null, IGN: null },
		RED_MID: { Champion: null, IGN: null },
		RED_ADC: { Champion: null, IGN: null },
		RED_SUPPORT: { Champion: null, IGN: null },
	};

	load(player: any) {
		if (player.appendIcon === 'mdi-progress-check') return;
		player.appendIcon = 'mdi-progress-helper';
		player.loading = true;
		player.disabled = true;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ign: player.IGN }),
		};
		fetch('http://api.localhost/lolai/load/', requestOptions).then((response) => {
			if (response.status !== 204) {
				player.appendIcon = 'mdi-alert-circle';
				player.loading = false;
				player.disabled = false;
			} else {
				player.appendIcon = 'mdi-progress-check';
				player.loading = false;
				player.disabled = false;
			}
		});
	}

	run() {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(this.Matchup),
		};
		fetch('http://api.localhost/lolai', requestOptions).then((response) => {
			if (response.status == 204) {
				this.$notify({
					title: 'Processing added',
					text: 'A processing has been added to the queue. You can find the results in the Matchups tab.',
					type: 'success',
				});
			}
		});
	}
}
</script>

<style>
.v-col {
	text-align: center;
}
</style>

