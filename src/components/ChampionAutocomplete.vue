<template>
	<v-autocomplete
		:v-model="value"
		@update:model-value="$emit('update:modelValue', $event.value)"
		:label="label"
		:items="championsList"
		return-object
		auto-select-first
	>
		<template #item="{ item, props }">
			<v-list-item @click="props.onClick">
				<img :src="item.raw.img" style="height: 30px; vertical-align: middle" />
				<h2 class="ml-5" style="display: inline; vertical-align: middle">{{ item.title }}</h2>
			</v-list-item>
		</template>
		<template #chip="{ item }">
			<v-list-item>
				<img :src="item.raw.img" style="height: 20px; vertical-align: middle" />
				<h4 class="ml-3" style="display: inline; vertical-align: middle">{{ item.title }}</h4>
			</v-list-item>
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'vue-facing-decorator';
const champions: any = await import('@/assets/champions.json');

@Component
export default class ChampionAutocomplete extends Vue {
	@Model
	readonly value!: string;

	@Prop
	public label!: string;

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

}
</script>
