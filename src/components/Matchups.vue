<template>
	<v-sheet class="mx-auto pa-5" width="1500">
		<v-row>
			<v-col><h3>Blue Team</h3></v-col>
			<v-col><h3>Red Team</h3></v-col>
		</v-row>
		<v-row>
			<v-col><p>Algorithm</p></v-col>
			<v-col><p>Top</p></v-col>
			<v-col><p>Jungle</p></v-col>
			<v-col><p>Mid</p></v-col>
			<v-col><p>Adc</p></v-col>
			<v-col><p>Support</p></v-col>
			<v-col><p>Prediction</p></v-col>
			<v-col><p>Top</p></v-col>
			<v-col><p>Jungle</p></v-col>
			<v-col><p>Mid</p></v-col>
			<v-col><p>Adc</p></v-col>
			<v-col><p>Support</p></v-col>
			<v-col><p>Result</p></v-col>
		</v-row>
		<v-row v-for="matchup in matchups" :key="matchup.id">
			<v-col
				><p>{{ matchup.algo }}</p></v-col
			>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.blue_top_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.blue_jungle_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.blue_mid_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.blue_adc_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.blue_support_champion)!.img" /></v-col>
			<v-col>
				<div v-if="matchup.status == 'pending'">Pending Queue</div>
				<v-progress-circular v-else-if="matchup.status == 'processing'" indeterminate :size="60" :width="10" />
				<v-menu v-else>
					<template v-slot:activator="{ props }">
						<v-icon style="transform: scale(2)" size="x-large" :icon="statusIcon(matchup.status)" v-bind="props" />
					</template>
					<v-list>
						<v-list-item @click="rerun(matchup, 'NB')">
							<v-list-item-title>Rerun with Naive Bayes</v-list-item-title>
						</v-list-item>
						<v-list-item @click="rerun(matchup, 'KNN')">
							<v-list-item-title>Rerun with KNN</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.red_top_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.red_jungle_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.red_mid_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.red_adc_champion)!.img" /></v-col>
			<v-col><img height="75px" :src="championsList.find(c => c.value == matchup.red_support_champion)!.img" /></v-col>
			<v-col><v-icon style="transform: scale(2)" size="x-large" :icon="checkCorrectIcon(matchup.correct)" @click="updateCheck(matchup)" /></v-col>
		</v-row>
	</v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import ChampionAutocomplete from '@/components/ChampionAutocomplete.vue';
const champions: any = await import('@/assets/champions.json');

@Component({
	components: {
		ChampionAutocomplete,
	},
})
export default class Home extends Vue {
	matchups: any[] = [];
	poller = 0;

	get championsList() {
		let champs = Object.values(champions).map((champion: any) => {
			return {
				title: champion.name,
				value: champion.key,
				img: `https://ddragon.leagueoflegends.com/cdn/14.13.1/img/champion/${champion.id}.png`,
			};
		});

		return champs;
	}

	mounted() {
		this.getMatchups();
		this.poller = setInterval(() => {
			this.getMatchups();
		}, 5000);
	}

	unmounted() {
		clearInterval(this.poller);
	}

	statusIcon(status: string) {
		if (status == 'BLUE_WIN') {
			return 'mdi-arrow-left';
		} else if (status == 'RED_WIN') {
			return 'mdi-arrow-right';
		}
	}

	checkCorrectIcon(correct: string | null) {
		if (correct == null) {
			return 'mdi-help';
		} else if (correct == '1') {
			return 'mdi-check-bold';
		} else {
			return 'mdi-close';
		}
	}

	updateCheck(matchup: any) {
		matchup.correct = matchup.correct == null ? true : !matchup.correct;
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: matchup.id, correct: matchup.correct }),
		};
		fetch('http://api.localhost/lolai/match', requestOptions);
	}

	getMatchups() {
		const requestOptions = {
			method: 'GET',
		};
		fetch('http://api.localhost/lolai', requestOptions)
			.then((response) => response.text())
			.then((data) => {
				this.matchups = JSON.parse(data);
			});
	}

	rerun(matchup: any, algo: string) {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: matchup.id, algo: algo }),
		};
		fetch('http://api.localhost/lolai/rerun', requestOptions).then((response) => {
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

<style lang="scss">
.v-col {
	text-align: center;
	justify-content: center;
	display: flex;

	& > * {
		align-self: center;
	}
}
</style>

