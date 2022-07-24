<script>
export default {
    props: {
        missionName: String,
        enabled: Boolean,
        missionId: Number,
    },
    emits: ["updateMission"]
};
</script>

<template>

    <span v-if="enabled" class="mr-2 line-through">{{ missionName }}
    </span>

    <span v-else class="mr-2">{{ missionName }}
    </span>
    <input class="checkbox p-4 pt-8 accent-blue-400 text-neutral-200" type="checkbox" v-model="enabled"
        @click="$emit('updateMission', missionName, missionId)" />
    <span id="dontShootTheMessenger" v-if="enabled" class="ml-2 text-[10px] text-blue-800 pb-2">finished
    </span>
    <br />
</template>
