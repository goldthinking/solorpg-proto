<template>
  <div class="game-script-stage-view">
    <ToolBar :items="allTools" />
    <StageHeader :stageName="chapterTitle" />
    <h2 class="script-header">第一章：神秘的开端</h2>
    <div class="script-content">
      <p v-for="(paragraph, index) in scriptContent" :key="index">{{ paragraph }}</p>
    </div>
    <button class="next-stage-btn" @click="goToSearchStage">阅读完毕，前往搜证</button>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";
export default {
  name: 'GameScriptStageView',
  components: {
    ToolBar,
    StageHeader
  },
  data() {
    return {
      chapterTitle: '剧本阶段',
      scriptContent: [
        '这是一个风雨交加的夜晚，你收到了一封烫金边的神秘邀请函。信封上用优雅的字体写着："亲爱的客人，诚邀您于今晚8点莅临玫瑰庄园，参加一场特别的聚会。"落款是庄园主人威廉·罗斯。',
        '当你冒着大雨抵达庄园时，一位彬彬有礼的老管家早已在门口等候。他微笑着接过你的外套，引领你穿过挂满历代主人肖像画的幽长走廊。走廊尽头是宽敞的客厅，几位客人已经在此等候：穿着考究的商人约翰·史密斯正擦拭着他的金丝眼镜；神情紧张的年轻女子玛丽·格林不安地摆弄着裙角；而沉默寡言的老医生林教授则站在窗边，若有所思地观察着窗外的暴雨。',
        '晚餐前，管家带领你们参观了庄园。在藏书室里，你注意到一本关于玫瑰栽培的古籍被特别标记；温室里盛开着罕见的黑色玫瑰；而威廉·罗斯的书桌上，放着一封被拆开的信件，上面隐约可见"玫瑰之心"的字样。',
        '晚餐时分，主人威廉·罗斯突然敲响酒杯宣布："各位贵宾，今晚邀请你们来，是因为庄园里藏有一件价值连城的宝物——传说中的玫瑰之心。据说它拥有神秘的力量，但只有最聪明的人才能找到它。"就在众人惊讶之际，一道闪电划破夜空，整个庄园瞬间陷入黑暗。',
        '黑暗中，你听到玻璃碎裂的声音和急促的脚步声。当灯光重新亮起时，主人已不知所踪。管家慌张地跑来报告："主人的房门被反锁了！"你们破门而入，只见威廉·罗斯倒在血泊中，胸口插着一把玫瑰形状的匕首...',
        '林医生立即上前检查，发现匕首上刻着奇怪的符号；约翰·史密斯注意到死者手中紧握着一片玫瑰花瓣；而玛丽·格林则惊恐地发现自己的手帕上沾有血迹。每个人都显得可疑，但真相究竟如何？'
      ],
      toolTypes: ['script', 'clue', 'character', 'note']
    }
  },
  methods: {
    goToSearchStage() {
      this.$router.push('/game-search-stage');
    }
  }
}
</script>

<style scoped>
.game-script-stage-view {
  padding: 20px;
  padding-top: calc(20px + var(--stage-header-height));
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 120px;
}

.script-header {
  margin-bottom: 30px;
}

.script-content {
  line-height: 1.8;
  font-size: 16px;
}

.script-content p {
  margin-bottom: 20px;
}

.next-stage-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: var(--accent-dark);
  color: var(--text-light);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

</style>