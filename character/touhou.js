'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'touhou',
		connect:true,
		characterSort:{
			touhou: {
        thstandard: ['reimu', 'marisa', 'suika', 'yukari', 'kyouko', 'kogasa', 'yuuka', 'alice', 'sanae', 'kanako', 'suwako', 'aya', 'nitori', 'shizuha', 'minoriko', 'lily', 'satori', 'koishi', 'cirno', 'letty', 'doremy', 'yamame', 'eika', 'komachi', 'kaguya', 'tewi', 'reisen', 'remilia', 'flandre', 'patchouli', 'mystia', 'iku']
      },
		},
		character:{
      reimu: ['female', 'hakurei', 4, ['fengmo', 'guayu'], ['zhu']],
      marisa: ['female', 'hakurei', 3, ['xingchen', 'sheyue']],
      suika: ['female', 'hakurei', 4, ['shantou', 'zuiyan']],
      yukari: ['female', 'hakurei', 4, ['jiejie']],
      kyouko: ['female', 'hakurei', 3, ['huiyin', 'kuopin']],
      kogasa: ['female', 'hakurei', 3, ['donghe', 'yeyu']],
      yuuka: ['female', 'hakurei', 4, ['sihua', 'yishi']],
      alice: ['female', 'hakurei', 3, ['diaoou', 'anji']],

      sanae: ['female', 'moriya', 4, ['kaihai', 'qiji'], ['zhu']],
      kanako: ['female', 'moriya', 4, ['yuzhu']],
      suwako: ['female', 'moriya', 3, ['jinlun', 'suiwa']],
      aya: ['female', 'moriya', 3, ['daoshe', 'fengmi']],
      nitori: ['female', 'moriya', 3, ['linshang', 'jiexun']],
      shizuha: ['female', 'moriya', 4, ['canye', 'diaofeng']],
      minoriko: ['female', 'moriya', 3, ['tuji', 'ganli']],
      lily: ['female', 'moriya', 3, ['michun', 'huawu']],

      satori: ['female', 'chitei', 3, ['xinyan', 'fangying', 'jiuju'], ['zhu']],
      koishi: ['female', 'chitei', 4, ['duannian', 'xinping']],
      cirno: ['female', 'chitei', 4, ['bingpu']],
      letty: ['female', 'chitei', 3, ['xuebeng', 'yaofeng', 'jihan']],
      doremy: ['female', 'chitei', 3, ['wuwo', 'mingmeng']],
      yamame: ['female', 'chitei', 4, ['zhangqi', 'zhusi']],
      eika: ['female', 'chitei', 3, ['zhushi', 'boyao', 'zhiwan']],
      komachi: ['female', 'chitei', 4, ['yiming']],

      kaguya: ['female', 'getsumen', 3, ['jiunan', 'yuzhi', 'zhuqu'], ['zhu']],
      tewi: ['female', 'getsumen', 3, ['qiangyun', 'jiahu']],
      reisen: ['female', 'getsumen', 3, ['xianbo', 'huanni']],
      remilia: ['female', 'getsumen', 3, ['shiling', 'xuewang']],
      flandre: ['female', 'getsumen', 4, ['wosui', 'heiyan']],
      patchouli: ['female', 'getsumen', 3, ['shengyao', 'xianshi']],
      mystia: ['female', 'getsumen', 3, ['yemang', 'hunqu']],
      iku: ['female', 'getsumen', 4, ['citan']]
		},
		characterIntro:{},
		perfectPair:{},
		skill:{
			// 博丽灵梦
      fengmo: {
        enable: 'phaseUse',
        audio: false,
        filter: function(event, player) {
          return !player.hasSkill('fengmo_disabled') && (player.countSpell() > 0 || player.countCards('h') >= 2);
        },
        filterCard: function(card, player) {
          return true;
        },
        selectCard: [0, 2],
        check: function(card) {
					var player = get.owner(card);
          var threshold = 1;
          if (player.countSpell() > 0 && player.countCards('h', 'sha') > 0 && !player.shaNoLimit()) {
            threshold += 5;
          }
					return threshold - get.value(card);
				},
        filterTarget: function(card, player, target) {
          return player != target && !target.hasSkill('fengmo_targeted') && (target.countSpell() > 0 || target.countCards('h') >= 2);
        },
        filterOk: function() {
          if (ui.selected.cards.length == 0)
            return _status.event.player.countSpell() > 0;
          return ui.selected.cards.length == 2;
        },
        content: function() {
          'step 0'
          if (cards.length == 0) {
            player.removeSpell(1);
          }
          'step 1'
          target.addTempSkill('fengmo_targeted');
          var force = target.countSpell() == 0;
          var prompt = force ? '请弃置两张手牌' : '请弃置两张手牌，否则失去一张符卡';
          target.chooseToDiscard('h', force, prompt, 2)
            .set('ai', card => {
              if (cards.length == 0) {
                if (target.countCards('h', 'sha') > 0) {
                  return 6 - get.value(card);
                }
                return 3 - get.value(card);
              } else {
                if (target.countSpell() > 1 || target.shaNoLimit() || target.countCards('h', 'sha') == 0) {
                  return -1;
                }
                return 2 - get.value(card);
              }
            });
          'step 2'
          if (!result.bool) {
            target.removeSpell(1);
          }
          if ((cards.length > 0 && !result.bool) || (cards.length == 0 && result.bool)) {
            player.addTempSkill('fengmo_disabled');
          }
        },
        subSkill: {
          disabled: { charlotte: true },
          targeted: { charlotte: true }
        },
        ai: {
          result: {
            target: function(player, target) {
              if (target.shaNoLimit()) return 0;
              var diff = target.countCards('h') - 2;
              var value = -0.5;
              value += (target.countSpell() - 1) * 0.5;
              var throw_spell = false;
              if (target.countSpell() == 1) {
                var cards = target.getKnownCards(player, c => c.name == 'sha');
                var other_cards = target.getKnownCards(player);
                var has_target = target.getEnemies().some(p => p != target && target.inRange(p));
                if (!(has_target && (cards.length > 0 || (diff >= 2 && other_cards.length < target.countCards('h'))))) {
                  throw_spell = true;
                }
              }
              if (!throw_spell) {
                value -= (4 - Math.min(diff, 4)) * 0.25;
              }
              return value;
            }
          },
          order: 5
        }
      },
      guayu: {
        audio: false,
        zhuSkill: true,
        trigger: {global: 'phaseUseBegin'},
        filter: function(event, player) {
          return event.player != player && event.player.group == 'hakurei' && player.hasZhuSkill('guayu', event.player) && event.player.countSpell() > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          trigger.player.chooseBool(`###是否发动${get.translation(player)}的【卦玉】？###${lib.translate.guayu_info}`)
            .set('ai', () => {
              if (get.attitude(trigger.player, player) <= 0 && player.countSpell() > 1) return false;
              if (trigger.player.countCards('hm', 'sha') == 0)
                return true;
              if (trigger.player.shaNoLimit()) return true;
              for (var sha of trigger.player.getCards('hm', 'sha')) {
                if (trigger.player.hasValueTarget(sha)) return false;
              }
              return true;
            });

          'step 1'
          if (result.bool) {
            player.logSkill('guayu');
            trigger.player.line(player, 'green');
            trigger.player.removeSpell(1);
            player.addSpell(1);
            trigger.player.draw();
          }
        }
      },

      // 雾雨魔理沙
      xingchen: {
        shaRelated: true,
        audio: false,
        trigger: { source: 'damageSource' },
        filter: function(event, player) {
          if (event._notrigger.contains(event.player)) return false;
          if (!event.card || event.card.name != 'sha' || event.getParent().name != 'sha')
            return false;
          if (!player.storage.xingchen) player.storage.xingchen = [];
          var list = game.filterPlayer(p => p != player && event.player.inRange(p) && !player.storage.xingchen.contains(p) && player.canUse('sha', p, false));
          return list.length > 0;
        },
        check: function(event, player) {
          if (!player.storage.xingchen) player.storage.xingchen = [];
          var list = game.filterPlayer(p => p != player && event.player.inRange(p) && !player.storage.xingchen.contains(p) && player.canUse('sha', p, false) && get.attitude(player, p) < 0);
          return list.length > 0;
        },
        content: function() {
          'step 0'
          player.judge(card => {
            if (get.color(card) != 'black') return -2;
            return 2;
          }).judge2 = function(result) {
            return result.bool;
          }

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.chooseTarget(true, '###星尘###选择一名【杀】的目标角色', (card, player, target) => {
            var anchor = trigger.player;
            if (!player.storage.xingchen) player.storage.xingchen = [];
            return target != player && anchor.inRange(target) && !player.storage.xingchen.contains(target) && player.canUse('sha', target, false);
          })
            .set('ai', target => {
              return -get.attitude(player, target);
            });

          'step 2'
          if (result.bool) {
            var target = result.targets[0];
            player.useCard({name: 'sha'}, target, 'xingchen', false);
          }
        },
        group: ['xingchen_sha', 'xingchen_sha_clear'],
        subSkill: {
          sha: {
            trigger: { player: 'useCardToPlayered' },
            silent: true,
            charlotte: true,
            priority: 5,
            filter: function(event, player) {
              return event.card.name == 'sha';
            },
            content: function() {
              if (!player.storage.xingchen) player.storage.xingchen = [];
              player.storage.xingchen.push(trigger.target);
            }
          },
          sha_clear: {
            trigger: { player: 'phaseAfter' },
            charlotte: true,
            silent: true,
            content: function() {
              delete player.storage.xingchen;
            }
          }
        }
      },
      sheyue: {
        audio: false,
        enable: ['chooseToRespond', 'chooseToUse'],
        filterCard: function(card, player) {
          return get.suit(card) == 'spade';
        },
        position: 'hes',
        viewAs: {name: 'sha'},
        viewAsFilter: function(player) {
          if (!player.countCards('hes', {suit: 'spade'})) return false;
        },
        prompt: '将一张黑桃牌当作【杀】使用或打出',
        check: function(card) {
					var val = get.value(card);
					if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
					return 5 - val;
				},
        group: ['sheyue_trigger'],
        subSkill: {
          trigger: {
            audio: false,
            shaRelated: true,
            trigger: {player: 'useCard', target: 'useCardToTargeted'},
            frequent: true,
            filter: function(event, player) {
              return event.card.name == 'sha' && get.color(event.card) != 'red';
            },
            content: function() {
              player.draw();
            }
          }
        },
        ai: {
          respondSha: true,
          effect: {
            target: function(card, player, target) {
              if (card.name == 'sha' && get.color(card) != 'red' && get.attitude(player, target) < 0) return [1, 0.6];
            },
            player: function(card, player, target) {
              if (card.name == 'sha' && get.color(card) != 'red') return [1, 1];
            }
          }
        }
      },

      // 伊吹萃香
      shantou: {
        audio: false,
        trigger: {player: 'phaseJieshuBegin'},
        filter: function(event, player) {
          return game.hasPlayer(p => p != player && p.getHp() > player.getHp());
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseTarget(false, get.prompt2('shantou'), (card, player, target) => {
            return target != player && target.getHp() > player.getHp();
          })
            .set('ai', target => {
              return -get.attitude(player, target) / Math.max(1, target.getHp());
            });

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          var target = result.targets[0];
          player.logSkill('shantou', target);
          player.line(target, 'green');
          target.damage();
          if (target.countCards('h') < player.countCards('h')) {
            target.draw();
          }
        }
      },
      zuiyan: {
        audio: false,
        trigger: {global: 'useCardAfter'},
        filter: function(event, player) {
          return event.card.name === 'jiu' && event.player.isPhaseUsing() && !player.hasSkill('zuiyan_blocker');
        },
        check: function(event, player) {
          if (get.attitude(player, event.player) <= 0) return false;
          var peach_num = player.countCards('hm', 'tao') + player.countCards('hm', 'jiu');
          for (var p of game.players) {
            if (player != p && get.attitude(player, p) > 0) {
              peach_num += p.getKnownCards(player, 'tao', true);
            }
          }
          if (peach_num + player.getHp() >= 4) return true;
          if (player.countCards('hm', 'shan') > 0 && player.getHp() >= 3) return true;
          return false;
        },
        content: function() {
          'step 0'
          player.loseHp(1);
          player.addTempSkill('zuiyan_blocker');

          'step 1'
          trigger.player.chooseControl('获得一张符卡', '获得1点醉酒值')
            .set('prompt', `${get.translation(player)}发动了醉宴，请选择一项：`)
            .set('ai', () => {
              if (trigger.player.shaNoLimit()) return 1;
              const shaNum = trigger.player.countCards('hm', 'sha');
              if (trigger.player.countSpell() < shaNum) return 0;
              return 1;
            });

          'step 2'
          if (result.index === 0) {
            trigger.player.addSpell(1);
            trigger.player.popup('获得符卡');
          } else if (result.index === 1) {
            if(!trigger.player.storage.jiu) trigger.player.storage.jiu=0;
						trigger.player.storage.jiu++;
            trigger.player.syncStorage('jiu');
            trigger.player.popup('加重醉酒');
            game.log(trigger.player, '获得了一点醉酒值');
          }
        },
        subSkill: {
          blocker: {
            charlotte: true
          }
        }
      },

      // 八云紫
      jiejie: {
        audio: false,
        trigger: {global: 'phaseUseBegin'},
        filter: function(event, player) {
          return event.player != player && player.countCards('h') > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCard('h', get.prompt2('jiejie'), false, 1)
            .set('ai', card => {
              var target = trigger.player;
              if (get.attitude(player, target) < 0) {
                if (target.getAttackRange() <= 1 && target.countCards('h') <= 4) return 0;
                if (card.name == 'tao' || (card.name == 'jiu' && target.getDefense() <= 5)) return 0;
                var threshold = 0
                var shas = target.getKnownCards(player, c => c.name == 'sha');
                var unknowns = target.countCards('h') - target.getKnownCards(player).length;
                if (target.getAttackRange() > 1 && (shas.length > 0 || unknowns >= 2) && game.players.some(p => target.inRange(p) && target.distanceTo(p) > 1 && get.attitude(target, p) < 0 && get.attitude(player, p) > 0 && p.getDefense() <= 6)) {
                  threshold += 4;
                }
                var cards = target.getKnownCards(player, c => ['juedou', 'huogong', 'nanman', 'wanjian'].includes(c.name));
                if (cards.length > 0 && game.players.some(p => target.distanceTo(p) > 1 && get.attitude(target, p) < 0 && get.attitude(player, p) > 0 && p.getDefense() <= 6)) {
                  threshold += 2;
                }
                if (shas.length == 0 && unknowns >= 4 && game.players.some(p => target.distanceTo(p) > 1 && get.attitude(target, p) < 0 && get.attitude(player, p) > 0)) {
                  threshold += 3;
                }
                return threshold - get.value(card);
              } else if (get.attitude(player, target) > 0) {
                if (target.getDefense() <= 6 && target.getDamagedHp() > 0 && target.getKnownCards(player, c => c.name == 'tao').length < target.getDamagedHp() && card.name == 'tao' && player.getDefense() >= 8) {
                  return 12;
                }
                if (target.getDefense() <= 5 && target.getKnownCards(player, c => c.name == 'jiu').length == 0 && card.name == 'jiu' && player.getDefense() >= 6) {
                  return 11;
                }
                var threshold = 0;
                var shas = target.getKnownCards(player, c => c.name == 'sha');
                var unknowns = target.countCards('h') - target.getKnownCards(player).length;
                if ((shas.length > 0 || unknowns >= 2 || card.name == 'sha') && game.players.some(p => get.attitude(player, p) < 0 && !target.inRange(p))) {
                  threshold += 6;
                }
                if (card.name == 'tao' && target.getDamagedHp() - target.getKnownCards(player, c => c.name == 'tao').length > player.getDamagedHp()) {
                  threshold += 2;
                  if (player.getJudge('lebu')) threshold += 2;
                } else if (['lebu', 'guohe', 'jiedao'].includes(card.name)) {
                  threshold += 2;
                  if (player.getJudge('lebu')) threshold += 2;
                } else if (card.name == 'wuxie') {
                  threshold += 2;
                  if (player.getJudge('lebu')) threshold += 2;
                }
                if ((target.getKnownCards(player, c => c.name == 'shunshou').length > 0 || card.name == 'shunshou') && game.players.some(p => get.attitude(player, p) < 0 && target.distanceTo(p) > 1 && p.countCards('he') > 0)) {
                  threshold += 2;
                } else if ((target.getKnownCards(player, c => c.name == 'bingliang').length > 0 || card.name == 'bingliang') && game.players.some(p => get.attitude(player, p) < 0 && target.distanceTo(p) > 1)) {
                  threshold += 2;
                }
                return threshold - get.value(card);
              }
              return 0;
            });

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill('jiejie', trigger.player);
          player.line(trigger.player, 'green');
          player.give(result.cards, trigger.player);
          player.chooseControl('增益结界', '限制结界')
            .set('prompt', '结界：请选择一项')
            .set('choiceList', [
              `令${get.translation(trigger.player)}获得一张符卡，本回合与除其以外的角色距离为1，且使用【杀】能多指定一名目标`,
              `令${get.translation(trigger.player)}本回合不能对距离大于1的角色使用牌`
            ])
            .set('ai', () => {
              if (get.attitude(player, trigger.player) > 0) return 0;
              return 1;
            });

          'step 2'
          if (result.control == '增益结界') {
            game.log(player, '选择令', trigger.player, '获得<font color="#ff33aa">增益结界</font>');
            trigger.player.addSpell(1);
            trigger.player.addTempSkill('jiejie_buff');
          } else if (result.control === '限制结界') {
            game.log(player, '选择令', trigger.player, '获得<font color="#00cc77">限制结界</font>');
            trigger.player.addTempSkill('jiejie_debuff');
          }
        },
        subSkill: {
          buff: {
            charlotte: true,
            mod: {
              globalFrom: function(from, to) {
                return -Infinity;
              },
              selectTarget: function(card, player, range) {
                if (card.name != 'sha') return;
                if (range[1] == -1) return;
                range[1]++;
              }
            },
            mark: 'jiejie_buff',
            intro: {
              content: '与其他角色距离视为1；使用【杀】可以多指定一名目标'
            }
          },
          debuff: {
            charlotte: true,
            mod: {
              playerEnabled: function(card, player, target) {
                if (player.distanceTo(target) > 1) return false;
              }
            },
            mark: 'jiejie_debuff',
            intro: {
              content: '不能对距离大于1的角色使用牌'
            }
          }
        }
      },

      // 幽谷响子
      huiyin: {
        audio: false,
        trigger: {global: ['loseAfter', 'loseAsyncAfter']},
        filter: function(event, player) {
          if (event.type != 'discard' || event.getlx === false) return false;
          if (!event.player || !event.player.isAlive() || event.player == player) return false;
          var cards = event.cards.slice();
          var evt = event.getl(player);
          if (evt && evt.cards) cards.removeArray(evt.cards);
          for (var card of cards) {
            if (card.original == 'h' && get.position(card, true) == 'd' && player.countCards('he', c => get.suit(c, player) == get.suit(card, player)) > 0) {
              return true;
            }
          }
          return false;
        },
        direct: true,
        content: function() {
          'step 0'
          if (trigger.delay == false) game.delay();
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          var cards = trigger.cards.slice();
          var evt = trigger.getl(player);
          if (evt && evt.cards) cards.removeArray(evt.cards);
          player.chooseToDiscard('he', false, get.prompt2('huiyin'), 1, (card, player) => {
            return cards.find(c => get.suit(c, player) == get.suit(card, player));
          })
            .set('ai', card => {
              if (get.attitude(player, trigger.player) > 0) return 6 - get.value(card);
              return 0;
            });

          'step 2'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill('huiyin', trigger.player);
          player.line(trigger.player, 'green');
          trigger.player.draw();

          'step 3'
          game.delay();
        }
      },
      kuopin: {
        audio: false,
        trigger: {player: 'phaseDrawBegin2'},
        forced: true,
        preHidden: true,
        filter: function(event, player) {
          return !event.numFixed && !game.hasPlayer(p => p.getHp() < player.getHp());
        },
        content: function() {
          // player.logSkill('kuopin');
          trigger.num++;
          player.addTempSkill('kuopin_maxcards');
        },
        subSkill: {
          maxcards: {
            charlotte: true,
            mod: {
              maxHandcard: function(player, num) {
                return num + 2;
              }
            }
          }
        }
      },

      // 多多良小伞
      donghe: {
        audio: false,
        enable: 'phaseUse',
        filter: function(event, player) {
          return player.countCards('h') > 0;
        },
        usable: 1,
        filterCard: function(card, player) {
          return true;
        },
        selectCard: [1, Infinity],
        filterTarget: function(card, player, target) {
          return player != target && player.distanceTo(target) <= ui.selected.cards.length;
        },
        filterOk: function() {
          return ui.selected.targets.length > 0 && _status.event.player.distanceTo(ui.selected.targets[0]) <= ui.selected.cards.length;
        },
        check: function(card) {
          var player = get.owner(card);
          var min_dist = 999;
          var min_friend;
          for (var p of game.players) {
            if (get.attitude(player, p) > 0 && p.isTurnedOver() && player.distanceTo(p) < min_dist) {
              min_dist = player.distanceTo(p);
              min_friend = p;
            }
          }
          if (min_friend) {
            return 10 - get.value(card);
          }
          var min_cards = 999;
          var min_target;
          for (var p of game.players) {
            if (get.attitude(player, p) < 0 && Math.min(p.countCards('h') - 1, player.distanceTo(p)) < min_cards && !p.isTurnedOver()) {
              min_cards = Math.min(p.countCards('h') - 1, player.distanceTo(p));
              min_target = p;
            }
          }
          if (!min_target) return -1;
          if (ui.selected.cards.length >= Math.max(1, min_cards)) return -1;
          var threshold = 8;
          threshold -= ui.selected.cards.length * 1.5;
          console.log(card.name, threshold, get.value(card));
          return threshold - get.value(card);
        },
        content: function() {
          'step 0'
          var num = cards.length;
          target.chooseToDiscard('h', cards.length, false, '###恫吓###请弃置' + get.cnNumber(num) + '张手牌，否则摸一张牌并翻面')
            .set('ai', card => {
              if (target.isTurnedOver()) return -1;
              return 7 - get.value(card);
            });

          'step 1'
          if (!result.bool) {
            target.draw();
            target.turnOver();
          }
        },
        ai: {
          order: 7,
          threaten: 1.6,
          expose: 0.5,
          result: {
            target: function(player, target) {
              var att = get.attitude(player, target);
              if (target.isTurnedOver()) return Math.abs(att) * 1.5;
              else att = -Math.abs(att);
              var coeff = 1 / Math.max(1, player.distanceTo(target), target.countCards('h'));
              return att * coeff;
            }
          }
        }
      },
      yeyu: {
        audio: false,
        trigger: {global: ['loseAfter', 'loseAsyncAfter']},
        filter: function(event, player) {
          if (event.type != 'discard' || event.getlx === false) return false;
          if (!event.player || !event.player.isAlive()) return false;
          if (player.hasSkill('yeyu_used')) return false;
          var cards = event.cards.filter(c => c.original == 'h' && get.position(c, true) == 'd');
          return cards.length >= player.getHp() && cards.some(c => get.color(c) == 'black');
        },
        direct: true,
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          var cards = trigger.cards.filter(c => c.original == 'h' && get.position(c, true) == 'd' && get.color(c) == 'black');
          var num = cards.length;
          player.chooseTarget([1, num], '###' + get.prompt('yeyu') + '###选择至多' + get.cnNumber(num) + '名角色，这些角色各摸一张牌。', false)
            .set('ai', target => {
              return get.attitude(player, target) / Math.max(0.5, target.getDefense());
            });

          'step 2'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill('yeyu', result.targets);
          player.addTempSkill('yeyu_used');
          event.targets = result.targets;
          event.targets.sortBySeat();
          for (var target of event.targets) {
            player.line(target, 'green');
          }

          'step 3'
          var target = event.targets.shift();
          target.draw();

          'step 4'
          if (event.targets.length > 0) {
            event.goto(3);
          }
        },
        subSkill: {
          used: { charlotte: true }
        },
        ai: {
          maixie: true
        }
      },

      // 风见幽香
      sihua: {
        audio: false,
        enable: 'phaseUse',
        usable: 1,
        filter: function(event, player) {
          return player.countCards('h') > 0;
        },
        filterCard: function(card, player) {
          return ui.selected.cards.every(c => get.suit(c, player) != get.suit(card, player));
        },
        selectCard: [1, Infinity],
        complexCard: true,
        check: function(card) {
          var player = get.owner(card);
          var min_defense = 999;
          var min_target;
          for (var p of game.players) {
            if (get.attitude(player, p) < 0 && p.getDefense() < min_defense) {
              min_defense = p.getDefense();
              min_target = p;
            }
          }
          if (!min_target) return -1;

          var aux_threshold = 0;
          for (var p of game.players) {
            if (p != player && get.attitude(p, min_target) > 0 && player.countCards('h', c => c != card && !ui.selected.cards.includes(c) && c.getAiTag('damage') >= min_target.getHp())) {
              var cards = p.getKnownCards(player, 'tao', true);
              if (cards.some(c => get.suit(c, p) == get.suit(card, player))) {
                aux_threshold += 3;
              } else if (p.getUnknownNum(player, true) >= 3 && get.color(card, player) == 'red') {
                aux_threshold += 3;
              }
            }
          }

          var threshold = 0;
          var dist = player.distanceTo(min_target) - player.getAttackRange();
          if (!(ui.selected.cards.length >= dist && (ui.selected.cards.some(c => get.color(c) == 'red') || get.color(card) != 'red'))) {
            threshold = 6;
            threshold -= ui.selected.cards.length;
            if (get.color(card) == 'red') threshold += 2;
            var num = 0;
            for (var c of player.getCards('h')) {
              if (['sha', 'bingliang', 'shunshou'].includes(c.name) && player.getUseValue(c, false) > 0 && !ui.selected.cards.includes(c)) {
                num++;
              }
            }
            if (['sha', 'bingliang', 'shunshou'].includes(card.name) && player.getUseValue(card, false) > 0) num--;
            if (num <= 0) threshold = 0;
            else threshold += num * 0.5;
          }
          threshold += aux_threshold;
          // console.log(card.name, threshold, get.value(card));
          return threshold - get.value(card);
        },
        content: function() {
          'step 0'
          var num = cards.length;
          player.storage.sihua = { num };
          player.addSpell(num);
          player.addTempSkill('sihua_dist');
          for (var p of game.players.filter(pp => pp != player)) {
            p.storage.sihua = { source: player, cards };
            p.addTempSkill('sihua_limit');
          }
        },
        group: ['sihua_clear'],
        subSkill: {
          dist: {
            charlotte: true,
            mod: {
              globalFrom: function(from, to, dist) {
                if (!from.storage.sihua || !from.storage.sihua.num) return dist;
                return dist - from.storage.sihua.num;
              }
            }
          },
          limit: {
            charlotte: true,
            mod: {
              cardEnabled: function(card, player) {
                if (player.storage.sihua) {
                  var { source, cards } = player.storage.sihua;
                  if (source.distanceTo(player) <= 1 && cards.some(c => get.suit(c, player) == get.suit(card, player))) {
                    return false;
                  }
                }
              },
              cardRespondable: function(card, player) {
                if (player.storage.sihua) {
                  var { source, cards } = player.storage.sihua;
                  if (source.distanceTo(player) <= 1 && cards.some(c => get.suit(c, player) == get.suit(card, player))) {
                    return false;
                  }
                }
              }
            }
          },
          clear: {
            trigger: {player: 'phaseAfter'},
            charlotte: true,
            silent: true,
            content: function() {
              'step 0'
              for (var p of game.players) {
                delete p.storage.sihua;
              }
            }
          }
        },
        ai: {
          order: 7.1,
          result: {
            player: function(player) {
              var min_defense = 999;
              var min_target;
              for (var p of game.players) {
                if (get.attitude(player, p) < 0 && p.getDefense() < min_defense) {
                  min_defense = p.getDefense();
                  min_target = p;
                }
              }
              if (!min_target) return -1;
              return -get.attitude(player, min_target) / Math.max(1, min_target.getHp());
            }
          },
          directHit_ai: true
        }
      },
      yishi: {
        audio: false,
        trigger: {global: 'phaseJieshuBegin'},
        filter: function(event, player) {
          // console.log(player.getHistory());
          return player.getHp() == 1 && player.getHistory('damage').length > 0;
        },
        unique: true,
        mark: true,
        limited: true,
        content: function() {
          'step 0'
          player.awakenSkill('yishi');
          player.draw(3);
          player.recover();
          player.addTempSkill('yishi_dist', {player: 'phaseBefore'});
        },
        subSkill: {
          dist: {
            charlotte: true,
            mod: {
              globalTo: function(from, to, dist) {
                return dist + 2;
              }
            }
          }
        },
        intro: {
          content: 'limited'
        }
      },

      // 爱丽丝
      diaoou: {
        trigger: {global: 'phaseBefore', player: 'enterGame'},
        audio: false,
        direct: true,
        marktext: '偶',
        intro: {content: '成为吊偶目标'},
        filter: function(event, player) {
          return event.name != 'phase' || game.phaseNumber == 0;
        },
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          player.chooseTarget(1, false, `你可以指定一名其他角色成为“吊偶”角色`, `每当你受到伤害时，你可以弃置一张牌并对“吊偶”角色造成同属性等量伤害；<br>每当你失去体力时，你可以弃置一张牌并令“吊偶”角色失去等量的体力。`, (card, player, target) => target != player)
            .set('ai', target => {
              return -get.attitude(player, target) / Math.max(0.5, target.getHp());
            });

          'step 2'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill('diaoou', result.targets);
          var target = result.targets[0];
          player.line(target, 'green');
          player.storage.diaoou = target;
          target.addMark('diaoou', 1, false);
        },
        group: ['diaoou_change', 'diaoou_hurt'],
        subSkill: {
          change: {
            trigger: {player: 'phaseJieshuBegin'},
            audio: false,
            direct: true,
            content: function() {
              'step 0'
              if (player != game.me && !player.isOnline()) game.delayx();

              'step 1'
              player.chooseTarget(1, false, `你可以更改“吊偶”角色`, `每当你受到伤害时，你可以弃置一张牌并对“吊偶”角色造成同属性等量伤害；<br>每当你失去体力时，你可以弃置一张牌并令“吊偶”角色失去等量的体力。`, (card, player, target) => target != player && target.countMark('diaoou') <= 0)
                .set('ai', target => {
                  return -get.attitude(player, target) / Math.max(0.5, target.getHp());
                });

              'step 2'
              if (!result.bool) {
                event.finish();
                return;
              }
              player.logSkill('diaoou', result.targets);
              var target = result.targets[0];
              player.line(target, 'green');
              player.storage.diaoou = target;
              for (const p of game.players) {
                if (p.countMark('diaoou') > 0) {
                  p.clearMark('diaoou');
                }
              }
              target.addMark('diaoou', 1, false);
            }
          },
          hurt: {
            trigger: {player: ['damageEnd', 'loseHpEnd']},
            audio: false,
            direct: true,
            filter: function(event, player) {
              return player.countCards('he') > 0 && event.num > 0 && player.storage.diaoou && player.storage.diaoou.isAlive();
            },
            content: function() {
              'step 0'
              var target = player.storage.diaoou;
              event.target = target;
              var prompt = '';
              if (trigger.name == 'damage') {
                prompt = `###吊偶###是否弃置一张牌，对${get.translation(target)}造成${trigger.num}点${get.translation(trigger.nature)}伤害？`;
              } else {
                prompt = `###吊偶###是否弃置一张牌，令${get.translation(target)}失去${trigger.num}点体力？`
              }
              player.chooseToDiscard('he', 1, false, prompt)
                .set('ai', card => {
                  var threshold = 4;
                  if (target.getHp() <= trigger.num) threshold += 100;
                  if (get.position(card) == 'e' && card.name == 'baiyin') threshold += 10;
                  if (get.suit(card) == 'club') threshold += 6;
                  if (get.type2(card) == 'equip') threshold += 2;
                  return threshold - get.value(card);
                });

              'step 1'
              if (!result.bool) {
                event.finish();
                return;
              }
              player.logSkill('diaoou', event.target);
              player.line(event.target, 'green');
              if (trigger.name == 'damage') {
                event.target.damage(player, trigger.num, trigger.nature);
              } else {
                event.target.loseHp(trigger.num);
              }

              'step 2'
              game.delay();
            }
          },
          // clear: {
          //   trigger: {player: 'phaseBefore'},
          //   charlotte: true,
          //   silent: true,
          //   content: function() {
          //     'step 0'
          //     var target = player.storage.diaoou;
          //     if (target && target.isAlive()) {
          //       target.clearMark('diaoou', false);
          //     }
          //     delete player.storage.diaoou;
          //   }
          // }
        },
        ai: {
          maixie: true,
          maixie_hp: true
        }
      },
      anji: {
        trigger: {player: 'loseAfter', global: 'loseAsyncAfter'},
        audio: false,
        filter: function(event, player) {
          if (event.type != 'discard') return false;
          var evt = event.getl(player);
          if (!evt || !evt.cards2 || evt.cards2.length == 0) return false;
          for (var c of evt.cards2) {
            if (get.suit(c, player) == 'club' || get.type2(c, player) == 'equip') return true;
          }
          return false;
        },
        direct: true,
        content: function() {
          'step 0'
          var cards = trigger.getl(player).cards2;
          var has_club = false, has_equip = false;
          for (var c of cards) {
            if (get.suit(c, player) == 'club') has_club = true;
            if (get.type2(c, player) == 'equip') has_equip = true;
          }
          event.has_club = has_club;
          event.has_equip = has_equip;
          if (has_club) {
            player.chooseBool('###暗机###是否摸一张牌？').set('ai', () => true);
          }

          'step 1'
          if (result.bool) {
            player.logSkill('anji');
            player.draw();
          }

          'step 2'
          if (event.has_equip) {
            player.chooseTarget(1, false, '###暗机###是否弃置一名其他角色一张牌？', (card, player, target) => {
              return target != player && target.countCards('he') > 0;
            })
              .set('ai', target => {
                var value = get.result({name: 'guohe'}).target(player, target);
                return value * get.attitude(player, target);
              });
          }

          'step 3'
          if (!event.has_equip || !result.bool) {
            event.finish();
            return;
          }
          var target = result.targets[0];
          player.logSkill('anji', target);
          player.line(target, 'green');
          player.discardPlayerCard('he', target, 1, true);

          'step 4'
          game.delay();
        }
      },

      // 东风谷早苗
      kaihai: {
        audio: false,
        trigger: {player: 'damageEnd'},
        filter: function(event, player) {
          return game.players.some(p => p.countCards('h') > p.getHp());
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseTarget(1, false, `###${get.prompt('kaihai')}###选择一名角色，令其将手牌数弃至体力值`, (card, player, target) => {
            return target.countCards('h') > target.getHp();
          })
            .set('ai', target => {
              if (get.attitude(player, target) < 0) {
                return -get.attitude(player, target) * (target.countCards('h') - target.getHp()) / Math.max(target.getDefense(), 0.5)
              }
              var drawables = game.players
                .filter(p => get.attitude(player, p) > 0 && p.getDamagedHp() > p.countCards('h'))
                .sort((a, b) => (b.getDamagedHp() - b.countCards('h')) - (a.getDamagedHp() - a.countCards('h')));
              if (drawables.length > 0) {
                for (var drawable of drawables) {
                  var draw_num = drawable.getDamagedHp() - drawable.countCards('h');
                  var discard_num = target.countCards('h') - target.getHp();
                  if (discard_num - target.getHp() > draw_num - drawable.getHp()) continue;
                  return target.getDefense() / (target.countCards('h') - target.getHp());
                }
              }
              return -1;
            });

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          var target = result.targets[0];
          player.logSkill('kaihai', target);
          player.line(target, 'green');
          var num = target.countCards('h') - target.getHp();
          target.chooseToDiscard('h', num, true, `###开海###请弃置${num}张手牌`);

          'step 2'
          if (!game.players.some(p => p.countCards('h') < p.getDamagedHp())) {
            event.finish();
            return;
          }
          player.chooseTarget(1, false, `###开海###你可以再选择一名角色，令其将手牌数摸至已损失体力值`, (card, player, target) => {
            return target.countCards('h') < target.getDamagedHp();
          })
            .set('ai', target => {
              return get.attitude(player, target) / ((target.getDamagedHp() - target.countCards('h')) * Math.max(target.getDefense(), 0.5))
            });

          'step 3'
          if (!result.bool) {
            event.finish();
            return;
          }
          var target = result.targets[0];
          player.line(target, 'green');
          var num = target.getDamagedHp() - target.countCards('h');
          target.draw(num);
        },
        ai: {
          maixie: true
        }
      },
      qiji: {
        audio: false,
        zhuSkill: true,
        trigger: {global: 'judgeEnd'},
        filter: function(event, player) {
          return event.player != player && event.player.isAlive() && event.player.group == 'moriya' && player.hasZhuSkill('qiji', event.player) && event.result.color == 'red';
        },
        direct: true,
        content: function() {
          'step 0'
          trigger.player.chooseBool(`###是否发动${get.translation(player)}的【奇迹】？###${lib.translate.qiji_info}`)
            .set('choice', get.attitude(trigger.player, player) > 0);

          'step 1'
          if (result.bool) {
            player.logSkill('qiji');
            trigger.player.line(player, 'green');
            player.draw();
          }
        }
      },

      // 八坂神奈子
      yuzhu: {
        audio: false,
        enable: 'phaseUse',
        usable: 2,
        filter: function(event, player) {
          return player.getExpansions('yuzhu').length < 4;
        },
        content: function() {
          player.judge(card => {
            var cards = player.getExpansions('yuzhu');
            if (cards.some(c => get.suit(c) == get.suit(card))) return -2;
            return 2;
          })
            .set('judge2', function(result) {
              return result.bool;
            })
            .set('callback', lib.skill.yuzhu.callback);
        },
        callback: function() {
          var result = event.judgeResult;
          if (result.bool) {
            player.addToExpansion(result.card, 'gain2').gaintag.add('yuzhu');
          }
        },
        marktext: '柱',
        intro: {
          content: 'expansion',
          markcount: 'expansion'
        },
        group: 'yuzhu_end',
        subSkill: {
          end: {
            audio: false,
            trigger: {player: 'phaseJieshuBegin'},
            filter: function(event, player) {
              return player.getExpansions('yuzhu').length > 0;
            },
            direct: true,
            content: function() {
              'step 0'
              var prompts = ['一张：令一名角色摸一张牌'];
              var yuzhus = player.getExpansions('yuzhu');
              if (yuzhus.length >= 2) prompts.push('两张：令一名已受伤角色回复1点体力');
              if (yuzhus.length >= 3) prompts.push('三张：令一名角色翻面');
              if (yuzhus.length >= 4) prompts.push('四张：对一名角色造成2点雷电伤害');
              player.chooseCardButton([1, 4], false, `###御柱：你可以弃置任意张“柱”###${prompts.join('###')}`, yuzhus)
                .set('filterOk', () => {
                  if (ui.selected.buttons.length == 2) return game.players.some(p => p.isDamaged());
                  return true;
                })
                .set('ai', (button) => {
                  if (yuzhus.length >= 4) {
                    var tao_num = 0;
                    for (var p of game.players) {
                      if (get.attitude(player, p) <= 0) {
                        tao_num += p.getKnownCards(player, 'tao', true).length;
                      }
                    }
                    for (var p of game.players) {
                      if (get.attitude(player, p) < 0) {
                        var jiu_num = p.getKnownCards(player, 'jiu', true).length;
                        var eff = get.damageEffect(p, player, player, 'thunder')
                        if (eff > 0 && p.getHp() + tao_num + jiu_num <= 2) {
                          return 1;
                        }
                      }
                    }
                  }
                  if (yuzhus.length >= 2 && ui.selected.buttons.length < 2) {
                    if (game.players.some(p => get.attitude(player, p) > 0 && p.isDamaged() && p.getDefense() <= 6))
                      return 1;
                  }
                  if (yuzhus.length >= 4) {
                    if (game.players.some(p => get.attitude(player, p) < 0))
                      return 1;
                  }
                  if (yuzhus.length >= 3 && ui.selected.buttons.length < 3) {
                    if (game.players.some(p => (get.attitude(player, p) < 0 && !p.isTurnedOver()) || (get.attitude(player, p) > 0 && p.isTurnedOver())))
                      return 1;
                  }
                  if (ui.selected.buttons.length < 1) {
                    if (game.players.some(p => get.attitude(player, p) > 0 && p.getDefense() <= 4 && p.countCards('h') <= 1 && p.getKnownCards(player, 'tao', true) < 1))
                      return 1;
                  }
                  return -1;
                });

              'step 1'
              if (!result.bool) {
                event.finish();
                return;
              }
              event.num = result.links.length;
              player.loseToDiscardpile(result.links);
              if (event.num == 1) {
                player.chooseTarget(1, true, `御柱：令一名角色摸一张牌`)
                  .set('ai', target => {
                    if (get.attitude(player, target) > 0 && target.getDefense() <= 4 && target.countCards('h') <= 1 && target.getKnownCards(player, 'tao', true) < 1)
                      return get.attitude(player, target) / Math.max(0.5, target.getDefense());
                    return -1;
                  });
              } else if (event.num == 2) {
                player.chooseTarget(1, true, `御柱：令一名已受伤角色回复1点体力`, (card, player, target) => target.isDamaged())
                  .set('ai', target => {
                    if (get.attitude(player, target) > 0 && target.isDamaged() && target.getDefense() <= 6)
                      return get.attitude(player, target) / Math.max(0.5, target.getDefense());
                    return -1;
                  });
              } else if (event.num == 3) {
                player.chooseTarget(1, true, `御柱：令一名角色翻面`)
                  .set('ai', target => {
                    if (get.attitude(player, target) > 0 && target.isTurnedOver())
                      return get.attitude(player, target) * 1.5 / Math.max(0.5, target.getDefense());
                    if (get.attitude(player, target) < 0 && !target.isTurnedOver())
                      return -get.attitude(player, target) / Math.max(0.5, target.getDefense());
                    return -1;
                  });
              } else if (event.num == 4) {
                player.chooseTarget(1, true, `御柱：对一名角色造成2点雷电伤害`)
                  .set('ai', target => {
                    return -get.attitude(player, target) / Math.max(0.5, target.getHp());
                  });
              }

              'step 2'
              if (!result.bool) {
                event.finish();
                return;
              }
              var target = result.targets[0];
              player.line(target, 'green');
              if (event.num == 1) {
                target.draw(player);
              } else if (event.num == 2) {
                target.recover(player);
              } else if (event.num == 3) {
                target.turnOver();
              } else if (event.num == 4) {
                target.damage(player, 'thunder', 2);
              }
            },
            ai: {
              expose: 0.9
            }
          }
        },
        ai: {
          order: 10,
          result: {
            player: function(player) {
              return 10;
            }
          },
          threaten: 1.8
        }
      },

      // 泄矢诹访子
      jinlun: {
        audio: false,
        trigger: {player: ['damageBegin4', 'equipBegin']},
        forced: true,
        filter: function(event, player) {
          if (event.name == 'damage')
            return player.hasEmptySlot(2) && event.num > 1;
          if (event.name == 'equip')
            return player.hasEmptySlot(2) && player.isDamaged() && get.equiptype(event.card) == 2;
          return false;
        },
        content: function() {
          if (trigger.name == 'damage') {
            trigger.num = 1;
          } else if (trigger.name == 'equip') {
            player.recover('jinlun');
          }
        }
      },
      suiwa: {
        audio: false,
        trigger: {player: 'damageEnd'},
        filter: function(event, player) {
          return event.num > 0;
        },
        check: function(event, player) {
          return true;
        },
        content: function() {
          'step 0'
          player.judge(card => 2).set('judge2', result => result.bool);

          'step 1'
          event.card = result.card;
          if (get.color(event.card) == 'red') {
            player.chooseTarget([1, player.getDamagedHp()], false, `###祟蛙###你可以令至多${get.cnNumber(player.getDamagedHp())}名角色各摸一张牌`)
              .set('ai', target => {
                return get.attitude(player, target) / Math.max(0.5, target.getDefense());
              });
          } else if (get.color(event.card) == 'black') {
            player.moveCard(false, `###祟蛙###你可以移动场上一张牌`, ['移动来源', '移动目标']);
          }

          'step 2'
          if (get.color(event.card) == 'red' && result.bool) {
            for (var target of result.targets) {
              player.line(target, 'green');
              target.draw();
            }
          }
        },
        ai: {
          maixie: true,
          maixie_hp: true
        }
      },

      // 射命丸文
      daoshe: {
        audio: false,
        enable: 'phaseUse',
        usable: 1,
        filter: function(event, player) {
          return player.countCards('he') >= 2 && game.players.some(p => p != player && p.countCards('h') > 0);
        },
        selectCard: 2,
        position: 'he',
        filterCard: function(card, player) {
          return true;
          // if (ui.selected.cards.length == 0) return true;
          // var c = ui.selected.cards[0];
          // return get.type2(card) == get.type2(c);
        },
        // complexCard: true,
        filterTarget: function(card, player, target) {
          return target != player && target.countCards('h') > 0;
        },
        check: function(card) {
          var player = get.owner(card);
          if (game.players.some(p => get.attitude(player, p) < 0 && p.countCards('h') > p.getHp() + 3)) {
            return 11 - get.value(card);
          }
          return 6 - get.value(card);
        },
        content: function() {
          'step 0'
          target.chooseToDiscard('h', [1, 3], true, '###盗摄###请弃置一至三张手牌');

          'step 1'
          if (target.countCards('h') > target.getHp()) {
            player.gainPlayerCard(target, 'h', 1, false, `盗摄：你可以获得${get.translation(target)}的一张手牌`, 'visible')
              .set('ai', button => get.value(button.link));
          } else {
            player.draw();
          }
        },
        ai: {
          order: 8,
          result: {
            target: function(player, target) {
              var steal = game.players.some(p => p.countCards('h') > p.getHp() + 3 && get.attitude(player, p) < 0);
              if (steal) {
                if (target.countCards('h') > target.getHp() + 3 && get.attitude(player, target) < 0) {
                  return get.attitude(player, target) * target.countCards('h') / Math.max(0.5, target.getHp());
                }
                return 0;
              }
              return -Math.abs(get.attitude(player, target)) * Math.max(1, target.countCards('h') - target.getHp()) / Math.max(0.5, target.getHp());
            }
          },
          expose: 0.8,
          threaten: 1.3
        }
      },
      fengmi: {
        audio: false,
        trigger: {player: 'phaseDiscardBegin'},
        check: function(event, player) {
          return player.countCards('h') <= player.countMark('fengmi_add');
        },
        content: function() {
          player.draw();
          player.addTempSkill('fengmi_maxcards');
        },
        group: ['fengmi_add', 'fengmi_clear'],
        subSkill: {
          add: {
            audio: false,
            trigger: {global: ['loseAfter', 'loseAsyncAfter']},
            silent: true,
            filter: function(event, player) {
              if (_status.currentPhase != player) return false;
              if (!['use', 'discard', 'loseToDiscardpile'].includes(event.type) || event.getlx === false) return false;
              if (!event.player) return false;
              return event.cards.some(c => ('hse'.includes(c.original) || (event.gaintag_map[c.cardid] && event.gaintag_map[c.cardid].includes('muniu'))) && get.position(c) == 'd' && get.color(c) == 'red');
            },
            content: function() {
              for (var card of trigger.cards) {
                if (('hse'.includes(card.original) || (trigger.gaintag_map[card.cardid] && trigger.gaintag_map[card.cardid].includes('muniu'))) && get.position(card) == 'd' && get.color(card) == 'red') {
                  player.addMark('fengmi_add', 1, false);
                }
              }
            },
            mark: 'fengmi_add',
            marktext: '靡',
            intro: {
              content: '本回合因使用、打出或弃置而进入弃牌堆的红色牌数'
            },
          },
          clear: {
            charlotte: true,
            audio: false,
            trigger: {player: 'phaseAfter'},
            silent: true,
            content: function() {
              player.setMark('fengmi_add', 0, false);
              player.unmarkSkill('fengmi_add');
            }
          },
          maxcards: {
            charlotte: true,
            mod: {
              maxHandcard: function(player, num) {
                return player.countMark('fengmi_add');
              }
            }
          }
        }
      },

      // 河城荷取
      linshang: {
        audio: false,
        trigger: {player: 'phaseDrawBegin2'},
        direct: true,
        filter: function(event, player) {
          return event.num > 0;
        },
        content: function() {
          'step 0'
          var prompt = get.prompt2('linshang');
          var choices = [];
          for (var i = 1; i <= trigger.num; ++i) {
            choices.push(`少摸${get.cnNumber(i)}张牌`);
          }
          choices.push('cancel2');
          player.chooseControl(choices)
            .set('prompt', prompt)
            .set('ai', () => {
              if (choices.length == 1) return 'cancel2';
              if (player.getHp() == 1 || (player.getHp() == 2 && player.countCards('h') >= 2 && player.countCards('h', 'tao') + player.countCards('h', 'shan') == 0)) {
                return choices[choices.length - 2];
              }
              if (lib.filter.cardUsable({name: 'sha', isCard: true}, player, event.getParent('chooseToUse'))) {
                for (var p of game.players) {
                  if (get.attitude(player, p) < 0 && player.canUse('sha', p)) {
                    if (p.getUnknownNum(player, true) == 0 && p.getKnownCards(player, 'shan', true) == 0 && p.getHp() <= 2 && !p.hasBaguaEffect(player)) {
                      for (var card of player.getCards('h', 'sha')) {
                        var damage = {card, num: 2, nature: card.nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num >= 2)
                          return choices[choices.length - 2];
                      }
                      var card = {name: 'sha', isCard: true};
                      for (var nature of [null, 'fire', 'thunder']) {
                        var damage = {card, num: 1, nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num > 0)
                          return choices[choices.length - 2];
                      }
                    }
                    if (player.getEquip('guanshi') && p.getHp() <= 2 && player.countCards('he') >= 4) {
                      for (var card of player.getCards('h', 'sha')) {
                        var damage = {card, num: 2, nature: card.nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num >= 2)
                          return choices[choices.length - 2];
                      }
                      var card = {name: 'sha', isCard: true};
                      for (var nature of [null, 'fire', 'thunder']) {
                        var damage = {card, num: 1, nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num > 0)
                          return choices[choices.length - 2];
                      }
                    }
                    if (p.getHp() <= 1 && p.getKnownCards(player, 'shan', true) == 0 && p.getUnknownNum(player, true) <= 1 && !p.hasBaguaEffect(player)) {
                      var card = {name: 'sha', isCard: true};
                      for (var nature of [null, 'fire', 'thunder']) {
                        var damage = {card, num: 1, nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num > 0)
                          return choices[choices.length - 2];
                      }
                    }
                    if (p.getKnownCards(player, 'shan', true) == 0 && p.hasSkill('tengjia2')) {
                      var card = {name: 'sha', isCard: true};
                      for (var nature of ['fire', 'thunder']) {
                        var damage = {card, num: 1, nature};
                        if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num > 0)
                          return choices[choices.length - 2];
                      }
                    }
                  }
                }
              }
              if (trigger.num >= 2) {
                for (var p of game.players) {
                  if (get.attitude(player, p) < 0 && (p.getHp() + p.countCards('hm')) <= 4) {
                    return choices[0];
                  }
                }
              }
              return 'cancel2';
            });

          'step 1'
          if (result.control == 'cancel2') {
            event.finish();
            return;
          } else {
            var choice = result.index + 1;
            trigger.num -= choice;
            if (trigger.num >= 1 && game.players.some(p => p.countCards('h') > 0)) {
              player.chooseTarget(1, true, `###粼殇###请选择一名角色，令其弃置一张手牌`, (card, player, target) => target.countCards('h') > 0)
                .set('ai', target => {
                  return -get.attitude(player, target) / (Math.max(1, target.countCards('h')) + target.getHp() / 2);
                });
            } else if (trigger.num == 0) {
              var list = [];
              for (var name of lib.inpile) {
                if (get.type(name) != 'basic') continue;
                var card = {name, isCard: true};
                if (lib.filter.cardUsable(card, player, event.getParent('chooseToUse')) && game.hasPlayer(p => player.canUse(card, p))) {
                  list.push(['基本', '', name]);
                }
                if (name == 'sha') {
                  for (var nature of lib.inpile_nature) {
                    card.nature = nature;
                    if (lib.filter.cardUsable(card, player, event.getParent('chooseToUse')) && game.hasPlayer(p => player.canUse(card, p))) {
                      list.push(['基本', '', name, nature]);
                    }
                  }
                }
              }
              if (list.length > 0) {
                player.chooseButton(1, true, ['粼殇：视为使用一张基本牌', [list, 'vcard']])
                  .set('ai', button => {
                    if (player.getHp() == 1 || (player.getHp() == 2 && player.countCards('h') >= 2 && player.countCards('h', 'tao') + player.countCards('h', 'shan') == 0)) {
                      return button.link[2] == 'tao' ? 10 : -1;
                    }
                    if (lib.filter.cardUsable({name: 'sha', isCard: true}, player, event.getParent('chooseToUse'))) {
                      for (var p of game.players) {
                        if (get.attitude(player, p) < 0 && player.canUse('sha', p)) {
                          if (p.getUnknownNum(player, true) == 0 && p.getKnownCards(player, 'shan', true) == 0 && p.getHp() <= 2 && !p.hasBaguaEffect(player)) {
                            for (var card of player.getCards('h', 'sha')) {
                              var damage = {card, num: 2, nature: card.nature};
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num >= 2)
                                return button.link[2] == 'jiu' ? 10 : -1;
                            }
                            var card = {name: 'sha', isCard: true};
                            var max_damage = 0, max_nature;
                            for (var nature of [undefined, 'fire', 'thunder']) {
                              var damage = {card, num: 1, nature};
                              var num = player.calcDamage(player, p, damage).num;
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && num > max_damage) {
                                max_damage = num;
                                max_nature = nature;
                              }
                            }
                            return button.link[2] == 'sha' && button.link[3] == nature ? 10 : -1;
                          }
                          if (player.getEquip('guanshi') && p.getHp() <= 2 && player.countCards('he') >= 4) {
                            for (var card of player.getCards('h', 'sha')) {
                              var damage = {card, num: 2, nature: card.nature};
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && player.calcDamage(player, p, damage).num >= 2)
                                return button.link[2] == 'jiu' ? 10 : -1;
                            }
                            var card = {name: 'sha', isCard: true};
                            var max_damage = 0, max_nature;
                            for (var nature of [undefined, 'fire', 'thunder']) {
                              var damage = {card, num: 1, nature};
                              var num = player.calcDamage(player, p, damage).num;
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && num > max_damage) {
                                max_damage = num;
                                max_nature = nature;
                              }
                            }
                            return button.link[2] == 'sha' && button.link[3] == nature ? 10 : -1;
                          }
                          if (p.getHp() <= 1 && p.getKnownCards(player, 'shan', true) == 0 && p.getUnknownNum(player, true) <= 1 && !p.hasBaguaEffect(player)) {
                            var card = {name: 'sha', isCard: true};
                            var max_damage = 0, max_nature;
                            for (var nature of [undefined, 'fire', 'thunder']) {
                              var damage = {card, num: 1, nature};
                              var num = player.calcDamage(player, p, damage).num;
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && num > max_damage) {
                                max_damage = num;
                                max_nature = nature;
                              }
                            }
                            return button.link[2] == 'sha' && button.link[3] == nature ? 10 : -1;
                          }
                          if (p.getKnownCards(player, 'shan', true) == 0 && p.hasSkill('tengjia2')) {
                            var card = {name: 'sha', isCard: true};
                            var max_damage = 0, max_nature;
                            for (var nature of ['fire', 'thunder']) {
                              var damage = {card, num: 1, nature};
                              var num = player.calcDamage(player, p, damage).num;
                              if (player.isCardEffective(card, p) && !player.doNotHurt(p, num) && num > max_damage) {
                                max_damage = num;
                                max_nature = nature;
                              }
                            }
                            return button.link[2] == 'sha' && button.link[3] == nature ? 10 : -1;
                          }
                        }
                      }
                    }
                    return 0;
                  });
              }
            }
          }

          'step 2'
          if (trigger.num >= 1) {
            var target = result.targets[0];
            player.logSkill('linshang', target);
            player.line(target, 'green');
            target.chooseToDiscard('h', 1, true, '###粼殇###请弃置一张手牌');
          } else if (trigger.num == 0) {
            player.logSkill('linshang');
            var card = {name: result.links[0][2], nature: result.links[0][3], isCard: true};
            player.chooseUseTarget(card, true, false);
          }

          'step 3'
          game.delayx();
        }
      },
      jiexun: {
        audio: false,
        trigger: {player: 'phaseDiscardBegin'},
        filter: function(event, player) {
          return player.countMark('jiexun_add') < 3;
        },
        direct: true,
        content: function() {
          'step 0'
          event.times = 0;

          'step 1'
          var prompt = event.times == 0 ? get.prompt2('jiexun') : `###节汛：你可以继续摸一张牌###${lib.translate.jiexun_info}`;
          player.chooseBool(prompt).set('ai', () => true);

          'step 2'
          if (result.bool) {
            player.logSkill('jiexun');
            player.draw();
            event.times++;
            event.drawn = true;
          } else {
            event.finish();
            return;
          }

          'step 3'
          if (event.drawn && player.countMark('jiexun_add') < 3) {
            event.goto(1);
          }
        },
        group: ['jiexun_add', 'jiexun_clear'],
        subSkill: {
          add: {
            audio: false,
            trigger: {player: 'drawAfter'},
            silent: true,
            filter: function(event, player) {
              return Array.isArray(event.result) && event.result.length > 0 && _status.currentPhase == player;
            },
            content: function() {
              player.addMark('jiexun_add', trigger.result.length, false);
            }
          },
          clear: {
            audio: false,
            trigger: {player: 'phaseAfter'},
            silent: true,
            charlotte: true,
            content: function() {
              player.clearMark('jiexun_add', false);
            }
          }
        }
      },

      // 秋静叶
      canye: {
        audio: false,
        trigger: {player: 'useCardToPlayered'},
        filter: function(event, player) {
          return event.card.name == 'sha' && event.target.getHp() <= player.getHp() && event.target.countCards('he') > 0;
        },
        forced: true,
        popup: false,
        content: function() {
          'step 0'
          player.logSkill('canye', trigger.target);
          trigger.target.chooseToDiscard('he', 1, true, '###残叶###请弃置一张牌');
          'step 1'
          game.delay();
        },
        group: 'canye_extra',
        subSkill: {
          extra: {
            audio: false,
            trigger: {player: 'useCard2'},
            filter: function(event, player) {
              return event.card.name == 'sha' && game.hasPlayer(p => player != p && player.inRange(p) && player.distanceTo(p) <= 1 && !event.targets.includes(p));
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseTarget([1, Infinity], false, '###残叶###你可以选择任意名距离1以内的角色额外成为此【杀】目标', (card, player, target) => target != player && player.inRange(target) && player.distanceTo(target) <= 1 && !trigger.targets.includes(target))
                .set('ai', target => {
                  if (get.attitude(player, target) < 0 && player.isCardEffective(trigger.card, target)) {
                    var damage = {card: trigger.card, num: 1};
                    var num = player.calcDamage(player, target, damage).num;
                    if (num > 0 && !player.doNotHurt(target, num)) {
                      return 10 - get.attitude(player, target) / Math.max(0.5, target.getDefense());
                    }
                  } else if (trigger.targets.length + ui.selected.targets.length == 1) {
                    if (!player.isCardEffective(trigger.card, target)) return 1;
                    var damage = {card: trigger.card, num: 1};
                    var num = player.calcDamage(player, target, damage).num;
                    if (num == 0) return 1;
                  }
                  return -1;
                });

              'step 1'
              if (result.bool) {
                player.logSkill('canye', result.targets);
                trigger.targets = trigger.targets.concat(result.targets);
              }
            }
          }
        }
      },
      diaofeng: {
        audio: false,
        trigger: {global: 'useCard'},
        filter: function(event, player) {
          return event.player && event.player.isAlive() && event.targets && event.targets.length > 1;
        },
        check: function(event, player) {
          if (get.attitude(player, event.player) > 0) return true;
          if (get.attitude(player, event.player) < 0) return event.player.countCards('h') > 0;
          return false;
        },
        prompt: function(event) {
          return `###是否对${get.translation(event.player)}发动【凋风】？###${lib.translate.diaofeng_info}`
        },
        content: function () {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          player.line(trigger.player, 'green');
          trigger.player.judge(card => {
            if (get.color(card) == 'black') return 2;
            return -2;
          }).set('judge2', result => result.bool);

          'step 2'
          if (!result.bool) {
            event.finish();
            return;
          }
          if (trigger.player.countCards('h') == 0) {
            event.directDraw = true;
          } else {
            player.chooseControl()
              .set('choiceList', [`令${get.translation(trigger.player)}摸一张牌`, `令${get.translation(trigger.player)}弃置一张手牌`])
              .set('prompt', '凋风：请选择一项')
              .set('ai', () => {
                if (get.attitude(player, trigger.player) > 0) return 0;
                return 1;
              });
          }

          'step 3'
          if (event.directDraw || result.index == 0) {
            trigger.player.draw();
          } else if (result.index == 1) {
            trigger.player.chooseToDiscard('h', 1, true, '###凋风###请弃置一张手牌');
          }

          'step 4'
          game.delay();
        }
      },

      // 秋穰子
      tuji: {
        audio: false,
        enable: 'chooseToUse',
        usable: 1,
        filterCard: function(card, player) {
          return true;
        },
        viewAs: {name: 'wugu'},
        viewAsFilter: function(player) {
          if (!player.countCards('h')) return false;
        },
        prompt: '将一张手牌当作【五谷丰登】使用',
        check: function(card) {
					var val = get.value(card);
					if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
					return 5 - val;
				},
        group: 'tuji_add',
        subSkill: {
          add: {
            audio: false,
            trigger: {global: 'useCard'},
            filter: function(event, player) {
              return event.card.name == 'wugu';
            },
            frequent: true,
            content: function() {
              'step 0'
              player.draw();

              'step 1'
              player.chooseTarget(1, false, `###土祭###你可以指定一名角色作为【五谷丰登】的起始目标`, (card, player, target) => trigger.targets.includes(target))
                .set('ai', target => {
                  var enemy_pos_sum = 0;
                  var p = target;
                  var pos = 0;
                  do {
                    if (get.attitude(player, p) <= 0) {
                      enemy_pos_sum += pos;
                    }
                    p = p.getNext();
                    pos++;
                  } while (p && p != target);
                  return enemy_pos_sum;
                });

              'step 2'
              if (result.bool) {
                var target = result.targets[0];
                player.line(target, 'green');
                console.log(trigger);
                trigger.startPlayer = target;
                game.log(player, '指定了', target, '作为', trigger.card, '的起始目标');
                game.delay();
              } else {
                console.log(result);
              }
            }
          }
        },
        ai: {
          effect: {
            target: function(card, player, target) {
              if (card.name == 'wugu') return [0, 2];
            }
          }
        }
      },
      ganli: {
        forced: true,
        mod: {
          cardname: function(card, player) {
            if (card.name == 'jiu') return 'tao';
          }
        }
      },

      // 莉莉·霍瓦特
      michun: {
        audio: false,
        trigger: {global: 'judgeEnd'},
        filter: function(event, player) {
          return event.player.isAlive() && event.result.color == 'red' && get.position(event.result.card, true) == 'o';
        },
        check: function(event, player) {
          return get.attitude(player, event.player) > 0;
        },
        popup: false,
        prompt: function(event) {
          return `是否对${get.translation(event.player)}发动【觅春】？`;
        },
        prompt2: function(event) {
          return `你可以令${get.translation(event.player)}从弃牌堆获得此判定牌。`
        },
        content: function() {
          player.logSkill('michun', trigger.player);
          player.line(trigger.player, 'green');
          trigger.player.gain(trigger.result.card, 'gain2');
        },
        group: ['michun_judge'],
        subSkill: {
          judge: {
            audio: false,
            trigger: {global: 'useCardToTargeted'},
            filter: function(event, player) {
              return event.targets.length === 1 && get.color(event.card, false) === 'black' && (event.card.name === 'sha' || get.type(event.card, null, false) === 'trick') && !player.hasSkill('michun_blocker');
            },
            check: function(event, player) {
              return true;
            },
            prompt: function(event, player) {
              return `###是否发动【觅春】？###你可以进行一次判定${event.target === player ? '' : '：若结果为红色，则你不能再次发动此效果直到本轮结束'}。`;
            },
            content: function() {
              'step 0'
              player.logSkill('michun', trigger.target);
              player.line(trigger.target, 'green');
              player.judge();

              'step 1'
              if (player !== trigger.target && result.color === 'red') {
                player.addTempSkill('michun_blocker', 'roundStart');
              }
            }
          },
          blocker: {
            charlotte: true
          }
        }
      },
      huawu: {
        audio: false,
        enable: 'phaseUse',
        usable: 1,
        filter: function(event, player) {
          return player.countCards('he') >= 1;
        },
        filterCard: function(card, player) {
          return true;
        },
        position: 'he',
        selectCard: function() {
          const player = _status.event.player;
          if (ui.selected.cards.length === 1 && get.color(ui.selected.cards[0], player) !== 'red') {
            return 2;
          }
          return [1, 2];
        },
        complexCard: true,
        filterTarget: function(card, player, target) {
          if (ui.selected.targets.length > 0) {
            return ui.selected.targets[0] != player && target != player;
          }
          return target != player || target.isDamaged();
        },
        selectTarget: [1, 2],
        multitarget: true,
        multiline: true,
        filterOk: function() {
          if (ui.selected.targets.length == 1) {
            var target = ui.selected.targets[0];
            return target != _status.event.player || target.isDamaged();
          }
          if (ui.selected.targets.length == 2) {
            return !ui.selected.targets.includes(_status.event.player);
          }
          return false;
        },
        check: function(card) {
          var player = get.owner(card);
          if (ui.selected.cards.length === 1 && get.color(ui.selected.cards[0], player) === 'red') return -1;
          if (player.getDefense() <= 4) return -1;
          if (player.countCards('he') - player.countCards('h', 'tao') - player.countCards('h', 'wuzhong') <= 1) return -1;
          var wounded = game.players.filter(p => (p.isDamaged() || p != player) && get.attitude(player, p) > 0);
          if (!wounded.length) return -1;
          var maxLostHp = Math.max(...wounded.map(p => p.getDamagedHp()));
          var threshold = 4;
          threshold += maxLostHp * 2;
          return threshold - get.value(card);
        },
        content: function() {
          'step 0'
          if (targets.length == 2) {
            event.drawEach = true;
          } else if (targets.length == 1) {
            if (targets[0] == player) {
              event.drawOnly = true;
            } else if (!targets[0].isDamaged()) {
              event.drawEach = true;
            } else {
              var targetText = get.translation(targets[0]);
              var num = Math.min(3, targets[0].getDamagedHp()) + 1;
              player.chooseControl()
                .set('choiceList', [`令${targetText}摸${get.cnNumber(num)}张牌`, `你与${targetText}各摸一张牌`])
                .set('prompt', '花舞：请选择一项');
              event.drawChoosing = true;
            }
          }

          'step 1'
          if (event.drawChoosing) {
            if (result.index == 0) event.drawOnly = true;
            else if (result.index == 1) event.drawEach = true;
          }

          'step 2'
          if (event.drawOnly) {
            var num = Math.min(3, targets[0].getDamagedHp()) + 1;
            targets[0].draw(num);
          } else if (event.drawEach) {
            player.draw();
            targets.forEach(p => p.draw());
          }
        },
        ai: {
          order: 6,
          result: {
            target: function(player, target) {
              if (ui.selected.targets.length == 0) {
                return Math.abs(get.attitude(player, target)) * (target.getDamagedHp() + 1) / Math.max(0.5, target.getHp() + target.countCards('hm'));
              } else if (ui.selected.targets.length == 1) {
                var first = ui.selected.targets[0];
                if (first.getDamagedHp() >= 2 && target.getDamagedHp() < 2) {
                  return 0;
                }
                if (first.getHp() <= 2 && first.getDamagedHp() >= 2 && target.getHp() > first.getHp()) {
                  return 0;
                }
                if (first.getDamagedHp() >= 2 && first.countCards('hm') <= 2 && target.countCards('hm') > 2) {
                  return 0;
                }
                return Math.abs(get.attitude(player, target)) / Math.max(0.5, target.getHp() + target.countCards('hm'));
              }
              return 0;
            }
          },
          expose: 0.9,
          threaten: 1.4,
          needcard: true
        }
      },

      // 古明地觉
      xinyan: {
        audio: false,
        trigger: {player: ['phaseUseBegin', 'damageEnd']},
        filter: function(event, player) {
          var card = {name: 'duxin', isCard: true};
          return game.hasPlayer(p => player.canUse(card, p));
        },
        direct: true,
        content: function() {
          'step 0'
          if (trigger.name == 'damage') event.times = trigger.num;
          else event.times = 1;
          event.firstTime = true;

          'step 1'
          player.logSkill('xinyan');
          var prompt = event.firstTime ? `###心眼：你可以视为使用一张【读心术】###选择【读心术】的目标` : `###心眼：你可以再次视为使用一张【读心术】###选择【读心术】的目标`;
          event.firstTime = false;
          event.times--;
          player.chooseUseTarget(false, {name: 'duxin', isCard: true}, prompt);

          'step 2'
          if (event.times > 0 && result.bool) {
            event.goto(1);
          } else {
            event.finish();
          }
        },
        ai: {
          maixie: true,
          maixie_hp: true
        }
      },
      fangying: {
        audio: false,
        trigger: {global: 'phaseUseEnd'},
        filter: function(event, player) {
          return player != event.player && player.countCards('h') > 0 && event.player.getHp() >= player.getHp() && player.storage.fangying && (player.storage.fangying.first || player.storage.fangying.last);
        },
        direct: true,
        content: function() {
          'step 0'
          var list = [];
          var fangying = player.storage.fangying;
          if (fangying.first) {
            list.push([lib.translate[get.type(fangying.first)], '', fangying.first.name, fangying.first.nature]);
          }
          if (fangying.last && (!fangying.first || fangying.last.name != fangying.first.name || fangying.last.nature != fangying.first.nature)) {
            list.push([lib.translate[get.type(fangying.last)], '', fangying.last.name, fangying.last.nature]);
          }
          player.chooseButton(1, false, [`仿影：你可以选择一张要使用的牌`, [list, 'vcard']])
            .set('filterButton', (button, player) => {
              var name = button.link[2], nature = button.link[3];
              // console.log(lib.filter.cardEnabled(card, player));
              return player.hasUseTarget({name, nature, isCard: true});
            });
          
          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }

          var name = result.links[0][2], nature = result.links[0][3];
          var card = {name, nature, isCard: true};
          player.storage.fangying.viewAs = card;

          var next = player.chooseToUse();
					next.set('openskilldialog', `###仿影###请选择一张手牌，将其当作一张${get.translation(nature)}【${get.translation(name)}】使用（若不选择则将取消发动【仿影】）`);
					next.set('norestore', true);
					next.set('_backupevent', 'fangyingx');
					next.set('custom',{
						add:{},
						replace:{window:function(){}}
					});
					next.backup('fangyingx');
					next.set('targetRequired', !lib.card[name].notarget && lib.card[name].selectTarget != -1 && !(Array.isArray(lib.card[name].selectTarget) && lib.card[name].selectTarget.includes(-1)) && !lib.card[name].toself);
					next.set('complexSelect', lib.card[name].complexSelect);
          next.set('complexTarget', lib.card[name].complexTarget);
					next.set('filterTarget', function (_, player, target) {
            return player.canUse(card, target);
          });
          next.set('filterAddedTarget', lib.card[name].filterAddedTarget);
          next.set('multicheck', lib.card[name].multicheck);
          next.set('selectTarget', lib.card[name].selectTarget);
          next.set('filterOk', lib.card[name].filterOk);
					next.set('addCount', false);
					next.logSkill = 'fangying';
        },
        group: ['fangying_card', 'fangying_clear'],
        subSkill: {
          card: {
            audio: false,
            trigger: {global: 'useCard'},
            silent: true,
            filter: function(event, player) {
              return player != event.player && event.player == _status.currentPhase && event.isPhaseUsing(event.player) && !['shan', 'wuxie'].includes(event.card.name) && ['basic', 'trick'].includes(get.type(event.card));
            },
            content: function() {
              if (!player.storage.fangying) {
                player.storage.fangying = {};
              }
              if (!player.storage.fangying.first) {
                player.storage.fangying.first = {name: trigger.card.name, nature: trigger.card.nature, isCard: true};
              }
              player.storage.fangying.last = {name: trigger.card.name, nature: trigger.card.nature, isCard: true};
            }
          },
          clear: {
            charlotte: true,
            silent: true,
            trigger: {global: 'phaseUseAfter'},
            filter: function(event, player) {
              return true;
            },
            content: function() {
              delete player.storage.fangying;
            }
          }
        }
      },
      fangyingx: {
        audio: false,
        viewAs: function(cards, player) {
          return player.storage.fangying.viewAs;
        },
        filterCard: function(card, player) {
          return get.position(card) == 'h';
        },
        selectCard: 1
      },
      jiuju: {
        zhuSkill: true,
        mod: {
          globalFrom: function(from, to, dist) {
            var current = _status.currentPhase;
            if (!from.hasZhuSkill('jiuju', current)) return dist;
            if (current != from && current.group == 'chitei') return 1;
            return dist;
          }
        }
      },

      // 古明地恋
      duannian: {
        audio: false,
        trigger: {player: 'phaseUseBefore'},
        filter: function(event, player) {
          return player.countCards('h') >= 2 && !player.hasSkill('duannian_sha');
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCard('h', [2, Infinity], false, get.prompt2('duannian'))
            .set('ai', card => {
              if (player.countCards('hm', 'sha') == 0) return -1;
              var max_num = Math.max(2, player.countCards('h') - player.getHp());
              if (ui.selected.cards.length >= max_num) return -1;
              if (card.name == 'shan' && player.countCards('hm', 'shan') - ui.selected.cards.filter(c => c.name == 'shan').length <= 1) return -1;
              if (card.name == 'jiu' && (player.getHp() == 1 || player.getDefense() <= 7) && player.countCards('hm', 'tao') + player.countCards('hm', 'jiu') - ui.selected.cards.filter(c => ['tao', 'jiu'].includes(c.name)).length <= 1)
                return -1;
              if (card.name == 'tao') {
                if ((player.getHp() <= 1 || player.getDefense() <= 7) && player.countCards('hm', 'tao') - ui.selected.cards.filter(c => c.name == 'tao').length <= 2)
                  return -1;
                if ((player.getHp() <= 2 || player.getDefense() <= 8) && player.countCards('hm', 'tao') - ui.selected.cards.filter(c => c.name == 'tao').length <= 1)
                  return -1;
                if (game.hasPlayer(p => get.attitude(player, p) > 0 && (p.getHp() <= 1 || p.getDefense() <= 5))) {
                  var peach_num = player.countCards('hm', 'tao') - ui.selected.cards.filter(c => c.name == 'tao').length;
                  for (var p of game.players) {
                    if (player != p && get.attitude(player, p) > 0) {
                      peach_num += p.getKnownCards(player, 'tao', true);
                    }
                  }
                  if (peach_num <= 1) return -1;
                }
              }
              if (card.name == 'wuxie') {
                var wuxie_num = player.countCards('hm', 'wuxie') - ui.selected.cards.filter(c => c.name == 'wuxie').length;
                for (var p of game.players) {
                  if (player != p && get.attitude(player, p) > 0) {
                    wuxie_num += p.getKnownCards(player, 'wuxie', true);
                  }
                }
                if (wuxie_num <= 1) return -1;
              }
              var threshold = 11;
              if (card.name == 'sha') threshold -= 5;
              return threshold - get.value(card);
            });

          'step 1'
          if (result.bool && result.cards && result.cards.length) {
            player.logSkill('duannian');
            player.addToExpansion(result.cards, player, 'give').gaintag.add('duannian');
            trigger.cancel();
          }
        },
        intro: {
          content: 'expansion',
          markcount: 'expansion',
        },
        group: 'duannian_nextturn',
        subSkill: {
          nextturn: {
            audio: false,
            trigger: {player: 'phaseZhunbeiBegin'},
            filter: function(event, player) {
              return player.getExpansions('duannian').length > 0;
            },
            silent: true,
            content: function() {
              player.logSkill('duannian');
              player.gain(player.getExpansions('duannian'), 'gain2');
              player.addTempSkill('duannian_sha');
              player.addTempSkill('sha_nolimit');
            }
          },
          sha: {
            mod: {
              targetInRange: function(card, player, target, now) {
                if (card.name == 'sha') return true;
              },
              selectTarget: function(card, player, range) {
                if (card.name != 'sha' || range[1] == -1) return;
                range[1]++;
              }
            }
          }
        }
      },
      xinping: {
        mod: {
					targetEnabled: function(card, player, target) {
						if (target.getExpansions('duannian').length > 0 && ['juedou', 'nanman', 'duxin'].includes(card.name))
              return false;
					}
				}
      },

      // 琪露诺
      bingpu: {
        audio: false,
        trigger: {global: 'phaseZhunbeiBegin'},
        filter: function(event, player) {
          return player != event.player && player.inRange(event.player) && player.countCards('h') > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCard('h', 1, false, get.prompt2('bingpu', trigger.player))
            .set('ai', card => {
              if (player.countCards('h') <= 1) return -1;
              if (player.countCards('h') <= 2 && player.getHp() <= 1) return -1;
              if (get.attitude(player, trigger.player) == 0) return -1;
              if (get.attitude(player, trigger.player) > 0) {
                if (card.name == 'tao' && trigger.player.isDamaged() && trigger.player.getHp() + trigger.player.getKnownCards(player, 'tao', true).length <= trigger.player.maxHp / 2)
                  return 15;
                if (card.name == 'jiu' && (trigger.player.getHp() <= 1 || trigger.player.getDefense() <= 5) && trigger.player.getKnownCards(player, 'tao', true).length + trigger.player.getKnownCards(player, 'jiu', true).length == 0)
                  return 14;
                if (trigger.player.hasJudge('lebu') || trigger.player.hasJudge('bingliang'))
                  return 8 - get.value(card, player);
                if (['wuzhong', 'guohe', 'shunshou', 'yaoshan', 'duxin', 'jiedao', 'tiesuo', 'huogong', 'juedou', 'lebu', 'bingliang'].includes(card.name) && player.hasJudge('lebu') && trigger.player.hasValueTarget(card))
                  return get.value(card, player);
                return -1;
              }
              if (trigger.player.countCards('he') == 0 && trigger.player.getCards('j').every(c => c.isBadJudge()))
                return -1;
              if (['tao', 'wuzhong', 'guohe', 'shunshou', 'yaoshan', 'lebu', 'bingliang'].includes(card.name) && trigger.player.hasValueTarget(card)) return -1;
              if (card.name == 'huogong' && trigger.player.countCards('h') >= 4 && trigger.player.hasValueTarget(card)) 
                return -1;
              if (get.subtype(card) == 'equip2' && trigger.player.hasEmptySlot(2)) return -1;
              if (get.subtype(card) == 'equip3' && trigger.player.hasEmptySlot(3)) return -1;
              if (card.name == 'shan' && trigger.player.getKnownCards(player, 'shan', true) == 0 && trigger.player.getUnknownNum(player, true) == 0)
                return -1;
              if (card.name == 'jiu') {
                if (trigger.player.getDefense() <= 6) return -1;
                if (trigger.player.getKnownCards(player, 'sha', true).length > 0 || trigger.player.getUnknownNum(player, true) >= 3) {
                  for (var p of game.players) {
                    if (get.attitude(player, p) > 0 && trigger.player.inRange(p) && (p.countCards('hm') <= 3 || p.getHp() <= 2) && (p.getKnownCards(player, 'shan', true).length == 0 || (trigger.player.hasSkill('guanshi_skill') && trigger.player.countCards('he') >= 4))) {
                      for (var nature of [undefined, 'fire', 'thunder']) {
                        var sha = {name: 'sha', nature, isCard: true, jiu: true};
                        var damage = {card: sha, num: 1, nature};
                        if (trigger.player.canUse(sha, p) && player.calcDamage(trigger.player, p, damage).num > 1)
                          return -1;
                      }
                    }
                  }
                }
              }
              return Math.min(6 - get.value(card, player), 5 - get.value(card, trigger.player));
            });

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill('bingpu', trigger.player);
          var card = result.cards[0];
          event.card = card;
          player.showCards(card, `${get.translation(player)}发动了【冰瀑】`);
          trigger.player.chooseControl()
            .set('choiceList', [`获得此${get.translation(card.nature)}【${get.translation(card.name)}】，然后跳过摸牌阶段`, `令${get.translation(player)}获得你区域内的一张牌`])
            .set('ai', () => {
              if (get.attitude(player, trigger.player) > 0) {
                if (card.name == 'tao' && trigger.player.isDamaged() && trigger.player.getHp() <= trigger.player.maxHp / 2)
                  return 0;
                if (card.name == 'jiu' && (trigger.player.getHp() <= 1 || trigger.player.getDefense() <= 5))
                  return 0;
                if (trigger.player.hasJudge('lebu') || trigger.player.hasJudge('bingliang')) return 1;
                return 0;
              }
              if (!trigger.player.getCards('he').some(c => get.value(c, trigger.player) >= 4 || get.value(c, player) >= 6)) 
                return 1;
              return 0;
            });
          
          'step 2'
          if (result.index == 0) {
            player.give(event.card, trigger.player, true);
            trigger.player.addTempSkill('bingpu_skipdraw');
          } else if (result.index == 1 && trigger.player.countCards('hej') > 0) {
            player.gainPlayerCard('hej', trigger.player, true);
          }
        },
        subSkill: {
          skipdraw: {
            audio: false,
            trigger: {player: 'phaseDrawBefore'},
            silent: true,
            content: function() {
              trigger.cancel();
              player.removeSkill('bingpu_skipdraw');
            }
          }
        }
      },

      // 蕾蒂·霍瓦特罗克
      xuebeng: {
        audio: false,
        trigger: {player: 'damageEnd'},
        filter: function(event, player) {
          return event.num > 0;
        },
        frequent: true,
        intro: {
          name: '雪',
          name2: '雪',
          content: 'expansion',
          markcount: 'expansion',
        },
        content: function() {
          'step 0'
          event.times = trigger.num;

          'step 1'
          event.times--;
          player.draw(2);
          player.chooseCard('h', 1, true, `###雪崩###请选择一张手牌作为“雪”置于武将牌上`)
            .set('ai', card => 20 - get.value(card));

          'step 2'
          player.addToExpansion(result.cards, player, 'give').gaintag.add('xuebeng');
          if (event.times > 0) event.goto(1);
        }
      },
      yaofeng: {
        audio: false,
        trigger: {player: ['phaseZhunbeiBegin', 'phaseJieshuBegin']},
        filter: function(event, player) {
          return player.getExpansions('xuebeng').length > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCardButton(1, false, player.getExpansions('xuebeng'), `###是否发动【妖风】？###弃置一张“雪”，令一名其他角色选择一项：1.弃置一张基本牌；2.失去1点体力。`)
            .set('ai', button => {
              return 5 - get.useful(button.link, player);
            });

          'step 1'
          if (result.bool) {
            event.cards = result.links;
            player.chooseTarget(1, true, `妖风：请选择一名其他角色`, (card, player, target) => target != player)
              .set('ai', target => {
                return -get.attitude(player, target) / Math.max(0.5, target.getDefense());
              });
          } else {
            event.finish();
            return;
          }

          'step 2'
          var target = result.targets[0];
          player.logSkill('yaofeng', target);
          event.target = target;
          player.logSkill('yaofeng', target);
          player.loseToDiscardpile(event.cards);
          target.chooseToDiscard(1, false, `###妖风###请弃置一张基本牌，否则失去1点体力`, card => get.type2(card) == 'basic')
            .set('ai', card => 11 - get.value(card, target));

          'step 3'
          if (!result.bool) {
            event.target.loseHp(1);
          }
        }
      },
      jihan: {
        audio: false,
        trigger: {player: 'phaseDrawBegin2'},
        filter: function(event, player) {
          return player.getExpansions('xuebeng').length > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCardButton([1, Infinity], false, player.getExpansions('xuebeng'), `###是否发动【积寒】？###你可以少摸一张牌并获得所选择的“雪”`)
            .set('ai', button => {
              var cards = player.getExpansions('xuebeng');
              if (cards.length == 1) return 10;
              if (cards.filter(c => get.useful(c, player) <= 5).length < cards.length / 2)
                return 10;
              return get.useful(button.link, player) - 5;
            });

          'step 1'
          if (result.bool) {
            player.logSkill('jihan');
            trigger.num--;
            player.storage.jihan = {cards: result.links};
            player.addTempSkill('jihan_after');
          }
        },
        subSkill: {
          after: {
            audio: false,
            trigger: {player: 'phaseDrawAfter'},
            charlotte: true,
            silent: true,
            filter: function(event, player) {
              return player.storage.jihan && player.storage.jihan.cards && player.storage.jihan.cards.length > 0;
            },
            content: function() {
              'step 0'
              player.gain(player.storage.jihan.cards, 'gain2');

              'step 1'
              if (player.getExpansions('xuebeng').length == 0) {
                player.addToExpansion(get.cards(1), player, 'gain2').gaintag.add('xuebeng');
              }
            }
          }
        }
      },

      // 哆来咪·苏伊特
      wuwo: {
        audio: false,
        trigger: {target: 'useCardToTarget'},
        filter: function(event, player) {
          return ['basic', 'trick'].includes(get.type(event.card)) && event.player.isAlive() && player.canCompare(event.player);
        },
        check: function(event, player) {
          var addi = function(card) {
            return (get.value(card) >= 8 && get.type(card) != 'equip') ? -6 : 0;
          }
          var target_cards = event.player.getKnownCards(player).sort((a, b) => get.number(b) - get.value(b) / 2 + addi(b) - get.number(a) + get.value(a) / 2 - addi(a));
          var target_unknown = event.player.getUnknownNum(player);
          var unknown_biggest = Math.floor(13 * target_unknown / (target_unknown + 1));
          var target_number = target_cards.length > 0 ? get.number(target_cards[0]) : 0;
          target_number = Math.max(target_number, unknown_biggest);

          if (get.attitude(player, event.player) > 0) {
            var need_wuwo = false;
            if (['wugu', 'taoyuan'].includes(event.card) && event.targets.some(p => get.attitude(player, p) < 0 && p.isDamaged()))
              need_wuwo = true;
            else if (['nanman', 'wanjian'].includes(event.card) && event.targets.some(p => get.attitude(player, p) && get.effect(p, event.card, event.player) < 0))
              need_wuwo = true;
            if (need_wuwo) {
              var my_cards = player.getCards('h').filter(c => get.value(c) < 8).sort((a, b) => get.number(a) + get.value(a) / 2 - addi(a) - get.number(b) - get.value(b) / 2 + addi(b));
              if (my_cards.length == 0) return false;
              var my_number = get.number(my_cards[0]);
              return my_number <= target_number;
            }
          } else if (get.attitude(player, event.player) < 0) {
            var need_wuwo = false;
            var tags = get.info(event.card).ai.tag || {};
            if (['sha', 'wanjian'].includes(event.card.name) && player.countCards('hm', 'shan') == 0) {
              need_wuwo = true;
            } else if (['nanman'].includes(event.card.name) && player.countCards('hm', 'sha') == 0) {
              need_wuwo = true;
            } else if (['juedou'].includes(event.card.name) && player.countCards('hm', 'sha') <= event.player.getKnownCards(player, 'sha', true).length + event.player.getUnknownNum(player, true) / 3) {
              need_wuwo = true;
            } else if (tags.loseCard && (player.hasKeyEquip() || player.getCards('h').some(c => get.value(c) >= 8))) {
              need_wuwo = true;
            } else if (tags.gain && player.getCards('he').some(c => event.player.getUseValue(c) >= 6 || get.value(c, event.player) >= 6)) {
              need_wuwo = true;
            }
            if (need_wuwo) {
              var my_cards = player.getCards('h').filter(c => get.value(c) < 8).sort((a, b) => get.number(b) - get.value(b) / 2 + addi(b) - get.number(a) + get.value(a) / 2 - addi(a));
              if (my_cards.length == 0) return false;
              var my_number = get.number(my_cards[0]);
              return my_number > target_number;
            }
          }

          return false;
        },
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          player.line(trigger.player, 'green');
          player.chooseToCompare(trigger.player)
            .set('small', get.attitude(player, trigger.player) > 0);

          'step 2'
          if (result.bool) {
            game.log('【', trigger.card, '】的目标', player, '被取消');
            trigger.targets.remove(player);
            trigger.getParent().triggeredTargets2.remove(player);
            trigger.untrigger();
            event.finish();
            return;
          } else {
            trigger.player.chooseTarget(1, false, `###无我：${get.translation(player)}拼点没赢###你可以为此【${get.translation(trigger.card)}】多指定或少指定一名目标`, (card, player, target) => {
              return trigger.targets.includes(target) || trigger.player.canUse(trigger.card, target);
            })
              .set('ai', target => {
                if (trigger.targets.includes(target)) return -get.effect(target, trigger.card, trigger.player) / Math.max(0.5, target.getDefense());
                return get.effect(target, trigger.card, trigger.player) / Math.max(0.5, target.getDefense());
              });
          }

          'step 3'
          if (result.bool) {
            var target = result.targets[0];
            trigger.player.line(target, 'green');
            if (trigger.targets.includes(target)) {
              game.log(trigger.player, '取消了【', trigger.card, '】的目标', target);
              trigger.targets.remove(target);
              trigger.getParent().triggeredTargets2.remove(target);
              trigger.untrigger();
            } else {
              game.log(trigger.player, '指定了', target, '成为【', trigger.card, '】的额外目标');
              trigger.targets.push(target);
            }
          }
        }
      },
      mingmeng: {
        audio: false,
        trigger: {player: ['chooseToCompareAfter', 'compareMultipleAfter', 'judgeEnd']},
        forced: true,
        filter: function(event, player) {
          if (['chooseToCompare', 'compareMultiple'].includes(event.name))
            return [event.card1, event.card2].filterInD('od').length > 0;
          if (event.name == 'judge')
            return get.position(event.result.card, true) == 'o';
          return false;
        },
        intro: {
          content: 'expansion',
          markcount: 'expansion',
        },
        content: function() {
          if (['chooseToCompare', 'compareMultiple'].includes(trigger.name)) {
            var cards = [trigger.card1, trigger.card2].filterInD('od');
            player.addToExpansion(cards, 'gain2').gaintag.add('mingmeng');
          } else if (trigger.name == 'judge') {
            player.addToExpansion(trigger.card, 'gain2').gaintag.add('mingmeng');
          }
        },
        group: 'mingmeng_distribute',
        subSkill: {
          distribute: {
            audio: false,
            trigger: {player: 'phaseZhunbeiBegin'},
            forced: true,
            filter: function(event, player) {
              return player.getExpansions('mingmeng').length >= player.countCards('h');
            },
            content: function() {
              'step 0'
              event.cards = game.cardsGotoOrdering(player.getExpansions('mingmeng')).cards;

              'step 1'
              if (event.cards.length > 0) {
                player.chooseCardButton([1, Infinity], false, event.cards, `明梦：请选择要分配的牌（取消则将剩余牌全部分配给自己）`)
                  .set('ai', button => {
                    if (ui.selected.cards.length >= 1) return -1;
                    try {
                      var c = button.link;
                      // console.log(c)
                      if (!c) return -1;
                      var max_need = 0;
                      var max_player;
                      for (var p of game.players) {
                        var diff;
                        if (p != player && get.attitude(player, p) > 1 && (diff = get.useful(c, p) - get.useful(c, player)) > max_need) {
                          max_need = diff;
                          max_player = p;
                        }
                      }
                    } catch (err) {
                      console.log(button.link)
                    }
                    if (max_player) return 1;
                    return -1;
                  });
              } else {
                player.unmarkSkill('mingmeng');
                event.finish();
                return;
              }

              'step 2'
              if (result.bool) {
                event.cards.removeArray(result.links);
                event.given = result.links;
                player.chooseTarget(1, true, result.links, `###明梦###请选择获得${get.translation(result.links)}的角色`)
                  .set('ai', target => {
                    return get.attitude(player, target) * get.value(card, target);
                  });
              } else {
                player.gain(event.cards, 'gain2');
                player.unmarkSkill('mingmeng');
                event.finish();
                return;
              }

              'step 3'
              var target = result.targets[0];
              player.line(target, 'green');
              target.gain(event.given, 'gain2');
              event.given = [];
              if (event.cards.length > 0) {
                event.goto(1);
              }
            }
          }
        }
      },

      // 黑谷山女
      zhangqi: {
        audio: false,
        trigger: {source: 'damageBegin2'},
        filter: function(event, player) {
          return event.num > 0 && event.player != player && event.player.countMark('zhangqi') == 0;
        },
        intro: {
          content: '受到的伤害视为火焰伤害且+1'
        },
        prompt: function(event, player) {
          return `是否对${get.translation(event.player)}发动【瘴气】？`
        },
        check: function(event, player) {
          return true;
          // if (event.num > 1) return false;
          // if (get.attitude(player, event.player) < 0) {
          //   if (event.num >= event.player.getHp()) return false;
          //   if (event.player.getDefense() > 6 && event.player.countSpell() > 0 && game.hasPlayer(p => get.attitude(player, p) > 0 && p.getDefense() <= 5 && event.player.inRange(p) && event.player.canUse({name: 'sha', isCard: true}, p)) && event.player.getKnownCards(player, 'sha', true).length + event.player.getUnknownNum() / 2 >= 1)
          //     return true;
          //   var all_respondShan = 0, all_respondSha = 0, all_others = 0;
          //   for (var p of game.players) {
          //     if (p != player && get.attitude(player, p) > 0 && !p.hasJudge('lebu') && !p.isTurnedOver()) {
          //       if (p.countSpell() > 0 || p.shaNoLimit()) {
          //         var spells = p.countSpell();
          //         for (var sha of p.getKnownCards(player, 'sha', true)) {
          //           if (p.canUse(sha, event.player) && p.isCardEffective(sha, event.player)) {
          //             all_respondShan++;
          //             if (p.getEquip('guanshi') && p.countCards('he') > 2) all_respondShan++;
          //             if (!p.shaNoLimit()) {
          //               spell--;
          //               if (spell == 0) break;
          //             }
          //           }
          //         }
          //       }
          //       for (var wanjian of p.getKnownCards(player, 'wanjian', true)) {
          //         if (p.canUse(wanjian, event.player) && p.isCardEffective(wanjian, event.player) && p.getUseValue(wanjian) > 0) {
          //           all_respondShan++;
          //         }
          //       }
          //       if (p.getKnownCards(player, 'sha', true).length + (p.getUnknownNum() + (p.hasJudge('bingliang') ? 0 : 2)) / 2 >= event.player.getKnownCards(player, 'sha', true).length + event.player.getUnknownNum() / 2) {
          //         var has_juedou = false;
          //         for (var juedou of p.getKnownCards(player, 'juedou', true)) {
          //           if (p.canUse(juedou, event.player) && p.isCardEffective(juedou, event.player)) {
          //             has_juedou = true;
          //             break;
          //           }
          //         }
          //         if (has_juedou) {
          //           all_respondSha += event.player.getKnownCards(player, 'sha', true);
          //           var wasteSha = all_respondSha;
          //           if (!p.shaNoLimit()) {
          //             wasteSha = Math.min(wasteSha, p.countSpell());
          //           }
          //           all_respondShan -= wasteSha;
          //         }
          //       }
          //       for (var nanman of p.getKnownCards(player, 'nanman', true)) {
          //         if (p.canUse(nanman, event.player) && p.isCardEffective(nanman, event.player) && p.getUseValue(nanman) > 0) {
          //           all_respondSha++;
          //         }
          //       }
          //       for (var huogong of p.getKnownCards(player, 'huogong', true)) {
          //         if (p.canUse(huogong, event.player) && p.isCardEffective(huogong, event.player) && p.countCards('h') + (p.hasJudge('bingliang') ? 0 : 2) >= 4) {
          //           all_others += Math.max(0, (p.countCards('h') + (p.hasJudge('bingliang') ? 0 : 2) - 1) / 4);
          //         }
          //       }
          //     }
          //   }
          //   if (all_respondShan * (event.player.hasBaguaEffect() ? 0.5 : 1) - event.player.getKnownCards(player, 'shan', true) + all_respondSha - event.player.getKnownCards(player, 'sha', true) + all_others - event.player.getUnknownNum() / 2 > 1)
          //     return true;
          // } else if (get.attitude(player, event.player) > 0) {
          //   if (event.num >= event.player.getHp() + player.allyTaoNum(event.player)) return true;
          // }
          // return false;
        },
        content: function(event, player) {
          // trigger.cancel();
          trigger.player.removeSpell(1);
          trigger.player.addMark('zhangqi', 1, false);
          player.addTempSkill('zhangqi_fire', {player: 'phaseBeginStart'});
        },
        subSkill: {
          fire: {
            audio: false,
            trigger: {global: 'damageBefore'},
            filter: function(event, player) {
              return event.player.countMark('zhangqi') > 0;
            },
            charlotte: true,
            forced: true,
            logTarget: 'player',
            content: function() {
              trigger.nature = 'fire';
              trigger.num++;
            },
            onremove: function(player) {
              game.countPlayer2(p => {
                if (p.countMark('zhangqi') > 0) {
                  p.clearMark('zhangqi', false);
                  p.unmarkSkill('zhangqi');
                }
              });
            }
          }
        }
      },
      zhusi: {
        audio: false,
        trigger: {player: ['recoverEnd', 'drawAfter']},
        filter: function(event, player) {
          if (event.name == 'draw')
            return event.getParent('phaseDraw').name != 'phaseDraw';
          return true;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseTarget(1, false, get.prompt2('zhusi'))
            .set('ai', target => {
              if (get.attitude(player, target) > 0 && target.isLinked() && target.isDamaged() && target.getEquip('baiyin'))
                return 20 * get.attitude(player, target) / Math.max(0.5, target.getDefense());

              var link_value = -1
              var default_value = -get.attitude(player, target) / (Math.max(0.5, target.getDefense()) * 10);
              if (get.attitude(player, target) < 0) {
                var linked = game.players.filter(p => get.attitude(player, p) < 0 && p.isLinked()).length;
                if (!target.isLinked()) {
                  var fire = {num: 1, nature: 'fire'}, thunder = {num: 1, nature: 'thunder'};
                  fire = player.calcDamage(player, target, fire);
                  thunder = player.calcDamage(player, target, thunder);
                  var max_damage = Math.max(fire.num, thunder.num);
                  if (max_damage >= 1) {
                    link_value = max_damage * get.attitude(player, target) / (Math.max(0.5, target.getDefense()) * (linked + 1));
                  }
                } else {
                  var value = 0;
                  value += player.getKeyEquipNum(target) * 0.5;
                  value += (target.getKnownCards(player, 'tao').length + target.getKnownCards(player, 'wuzhong').length + target.getKnownCards(player, 'guohe').length + target.getKnownCards(player, 'shunshou').length + target.getKnownCards(player, 'yaoshan').length) * 0.5;
                  if (target.getDefense() <= 5) {
                    value += target.getKnownCards(player, 'jiu').length * 0.5;
                  }
                  if (!target.hasJudge('lebu') && target.isDamaged()) {
                    value += target.getKnownCards(player, 'tao').length * 0.5;
                  }
                  link_value = value * get.attitude(player, target) / Math.max(0.5, target.getDefense());
                }
              }

              return Math.max(link_value, default_value);
            });

          'step 1'
          if (result.bool) {
            var target = result.targets[0];
            player.logSkill('zhusi', target);
            event.target = target;
            if (target.isLinked()) {
              event.unlink = true;
            }
            target.link();
          } else {
            event.finish();
            return;
          }

          'step 2'
          if (event.unlink && event.target.countCards('he') > 0) {
            player.discardPlayerCard(event.target, 'he', 1, false, `蛛丝：你可以弃置${get.translation(event.target)}一张牌`);
          }
        }
      },

      // 戎璎花
      zhushi: {
        audio: false,
        trigger: {global: ['loseAfter', 'loseAsyncAfter']},
        filter: function(event, player) {
          if (event.type != 'discard' || event.getlx === false) return false;
          if (!event.player || !event.player.isAlive()) return false;
          var cards = event.cards.filter(c => c.original == 'h' && get.position(c, true) == 'd');
          return cards.length >= 2 && cards.some(c => get.color(c) == 'red');
        },
        direct: true,
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          player.chooseCardButton([1, 5], false, trigger.cards, get.prompt2('zhushi'));

          'step 2'
          if (result.bool) {
            player.logSkill('zhushi');
            var cards = result.links;
            game.cardsGotoOrdering(cards);
            player.chooseToMove(true, `筑石：点击将牌移动到牌堆顶或牌堆底`)
              .set('list', [['牌堆顶', cards], ['牌堆底']])
              .set('processAI', list => {
                var cards = list[0][1], target = _status.currentPhase, isDrawing = false, isBoyao = false, changed = false;
                if (['phaseUse', 'phaseDiscard', 'phaseJieshu'].includes(trigger.currentPhase)) target = target.getNext();
                else if (trigger.currentPhase == 'phaseDraw') isDrawing = true;
                if (player.storage.boyao && player.storage.boyao.using) {
                  target = player;
                  isBoyao = true;
                }
                var top = [];
                do {
                  changed = false;
                  var stopped = false;
                  if (!isDrawing && !isBoyao) {
                    if (!target.hasWuxie()) {
                      var judges = target.getCards('j');
                      for (var i = 0; i < judges.length; i++) {
                        var judge = get.judge(judges[i]);
                        cards.sort((a, b) => {
                          return (judge(b) - judge(a)) * get.sgnAttitude(player, target);
                        });
                        if (judge(cards[0]) * get.sgnAttitude(player, target) < 0) {
                          stopped = true;
                          break;
                        } else {
                          top.unshift(cards.shift());
                          changed = true;
                        }
                      }
                    }
                  }
                  if (!stopped) {
                    cards.sort((a, b) => {
                      return get.value(b,target) - get.value(a,target);
                    });
                    while (cards.length) {
                      if (target == player && isBoyao) {
                        var next = player.getNext();
                        if (get.value(cards[0], target) > 5) {
                          if (get.attitude(target, next) < 0) break;
                          if (get.value(cards[0], next) <= get.value(cards[0], target) + 1) break;
                        } else {
                          if (get.attitude(target, next) < 0 && get.value(cards[0], next) > 5) break;
                        }
                      } else {
                        if (get.attitude(player, target) <= 0 && get.value(cards[0], target) > 5) break;
                        if (get.attitude(player, target) > 0 && get.value(cards[0], target) <= 5) break;
                      }
                      top.unshift(cards.shift());
                      changed = true;
                    }
                  }
                  if (isBoyao) {
                    target = _status.currentPhase.getNext();
                    isBoyao = false;
                  } else {
                    target = target.getNext();
                  }
                } while (cards.length > 0 && changed);
                var bottom = cards;
                return [top, bottom];
              });
          } else {
            event.finish();
            return;
          }

          'step 3'
          var top = result.moved[0], bottom = result.moved[1];
          top.reverse();
          game.cardsGotoPile(
            top.concat(bottom),
            ['top_cards', top],
            (event, card) => {
              if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
              return null;
            }
          )
          for (var c of top) c.addKnower(player);
          for (var c of bottom) c.addKnower(player);
          player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
					game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');

          'step 4'
          game.delayx();
        }
      },
      boyao: {
        audio: false,
        trigger: {global: 'phaseDiscardBegin'},
        filter: function(event, player) {
          return event.player != player && event.player.getStat('damage') > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          if (!player.storage.boyao) player.storage.boyao = {}
          player.storage.boyao.using = true;
          player.chooseToDiscard('h', [1, Infinity], false, `###是否对${get.translation(trigger.player)}发动【薄夭】？###${lib.translate.boyao_info}`)
            .set('ai', card => {
              if (get.attitude(trigger.player, player) <= 0) {
                if (trigger.player.countCards('h') == 0) return -1;
                var num = trigger.player.getHandcardLimit() - trigger.player.countCards('h');
                if (num >= player.countCards('h', c => get.value(c) > 6)) return -1;
              }
              return 6 - get.value(card);
            });

          'step 2'
          if (player.storage.boyao) delete player.storage.boyao.using;
          if (result.bool) {
            player.logSkill('boyao', trigger.player);
            event.num = result.cards.length;
            trigger.player.chooseControl()
              .set('choiceList', [`令${get.translation(player)}摸${get.cnNumber(event.num + 1)}张牌`, `本回合手牌上限-${event.num}`])
              .set('ai', () => {
                if (get.attitude(trigger.player, player) >= 0) return 0;
                if (trigger.player.countCards('h') == 0) return 1;
                var maxcards = Math.max(0, trigger.player.getHandcardLimit() - event.num);
                if (maxcards == 0 && trigger.player.getHp() <= 2 && trigger.player.threatenersNum() > 0) return 0;
                var cards = trigger.player.getCards('h').sort((a, b) => get.value(b, trigger.player) - get.value(a, trigger.player));
                if (cards.length <= maxcards) return 1;
                if (maxcards == 0) return get.value(cards[0], trigger.player) >= 5 ? 0 : 1;
                if (get.value(cards[maxcards - 1], trigger.player) < 5) return 1;
                if (get.value(cards[maxcards - 1], trigger.player) - get.value(cards[maxcards], trigger.player) < 1)
                  return 0;
                return 1;
              });
          } else {
            event.finish();
            return;
          }

          'step 3'
          if (result.index == 0) {
            player.draw(event.num + 1);
          } else {
            trigger.player.storage.boyao = {num: event.num};
            trigger.player.addTempSkill('boyao_maxcards');
          }
        },
        subSkill: {
          maxcards: {
            charlotte: true,
            mod: {
              maxHandcard: function(player, num) {
                if (!player.storage.boyao) return 0;
                return Math.max(0, num - player.storage.boyao.num);
              }
            }
          }
        }
      },
      zhiwan: {
        audio: false,
        trigger: {player: 'drawBegin'},
        forced: true,
        filter: function(event, player) {
          return _status.currentPhase != player;
        },
        content: function() {
          'step 0'
          player.chooseControl('从牌堆顶摸牌', '从牌堆底摸牌')
            .set('prompt', `蛭腕：请选择从牌堆顶或牌堆底摸牌`)
            .set('ai', () => {
              var top_value = 0, bottom_value = 0;
              for (var i = 0; i < trigger.num; ++i) {
                if (i >= ui.cardPile.childNodes.length) {
                  top_value += 4;
                  bottom_value += 4;
                } else {
                  var top = ui.cardPile.childNodes[i];
                  var bottom = ui.cardPile.childNodes[ui.cardPile.childNodes.length - i - 1];
                  if (top.isKnownBy(player)) top_value += get.value(top);
                  else top_value += 4;
                  if (bottom.isKnownBy(player)) bottom_value += get.value(bottom);
                  else bottom_value += 4;
                }
              }
              return bottom_value >= top_value ? 1 : 0;
            });

          'step 1'
          if (result.index == 0) {
            game.log(player, '选择从牌堆顶摸牌');
          } else if (result.index == 1) {
            game.log(player, '选择从牌堆底摸牌');
            trigger.bottom = true;
          }
        }
      },

      // 小野冢小町
      yiming: {
        audio: false,
        trigger: {global: 'phaseUseEnd'},
        filter: function(event, player) {
          return event.player != player && (event.player.getHistory('useCard').filter(evt => get.color(evt.card) == 'black').length > 0 || event.player.countCards('e') > player.countCards('e')) && player.countCards('he') > 0;
        },
        direct: true,
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline()) game.delayx();

          'step 1'
          if (trigger.player.getHistory('useCard').filter(evt => get.color(evt.card) == 'black').length > 0 && trigger.player.countCards('e') > player.countCards('e'))
            event.both = true;
          player.chooseToDiscard('he', false, 1, `###是否对${get.translation(trigger.player)}发动【刈命】？###${lib.translate.yiming_info}`)
            .set('ai', card => {
              if (get.attitude(player, trigger.player) >= 0) return -1;
              var damage = {card: {name: 'sha', isCard: true}, num: 1};
              damage = player.calcDamage(player, trigger.player, damage);
              if (damage.num == 0) return -1;
              var threshold = 7;
              threshold -= player.getDamagedHp();
              return threshold - get.value(card);
            });

          'step 2'
          if (result.bool) {
            var target = trigger.player;
            player.logSkill('yiming', target);
            player.useCard({name: 'sha'}, target, 'yiming', false);
            if (event.both) player.draw();
          }
        }
      },

      // 蓬莱山辉夜
      jiunan: {
        audio: false,
        trigger: {global: 'phaseUseEnd'},
        filter: function(event, player) {
          var max_times = 1;
          if (player.hasZhuSkill('zhuqu')) max_times = game.players.filter(p => p.group == 'getsumen').length;
          return event.player != player && player.countMark('jiunan') < max_times && event.player.getHistory('useCard', evt => ['basic', 'trick'].includes(get.type(evt.card))).length <= player.getDamagedHp();
        },
        check: function(event, player) {
          return true;
        },
        content: function() {
          player.addTempSkill('jiunan_round', 'roundStart');
          player.addMark('jiunan', 1, false);
          // if (player.countMark('jiunan') == 1) {
          //   player.draw(2);
          // } else {
          //   player.draw();
          // }
          player.draw();
          player.chooseToUse();
        },
        mark: true,
        intro: {
          content: function(storage, player) {
            var max_times = 1;
            if (player.hasZhuSkill('zhuqu')) max_times = game.players.filter(p => p.group == 'getsumen').length;
            return `本轮已发动 ${player.countMark('jiunan')}/${max_times} 次咎难`
          }
        },
        subSkill: {
          round: {
            charlotte: true,
            onremove: function(player) {
              player.clearMark('jiunan');
            }
          }
        }
      },
      yuzhi: {
        audio: false,
        trigger: {source: 'damageEnd'},
        filter: function(event, player) {
          return !player.inRange(event.player);
        },
        forced: true,
        content: function() {
          player.addSpell(1);
        },
        mod: {
          targetInRange: function(card, player) {
            if (player.getHistory('useCard', evt => evt.targets.some(target => target != player)).length == 0)
              return true;
          }
        }
      },
      zhuqu: {
        audio: false,
        zhuSkill: true,
        forced: true
      },

      // 因幡帝
      qiangyun: {
        audio: false,
        trigger: {global: 'judge'},
        direct: true,
        content: function() {
          'step 0'
          player.chooseCard('h', 1, false, get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' + get.translation(trigger.player.judging[0]) + '，' + get.prompt('qiangyun'), card => get.number(card) >= get.number(trigger.player.judging[0]))
            .set('ai', function(card) {
              var trigger = _status.event.getTrigger();
              var player = _status.event.player;
              var judging = _status.event.judging;
              var result = trigger.judge(card) - trigger.judge(judging);
              var attitude = get.attitude(player, trigger.player);
              console.log(result, attitude);
              if (attitude == 0 || result == 0) return 0;
              if (attitude > 0) return result;
              return -result;
            })
            .set('judging', trigger.player.judging[0]);
          
          'step 1'
          if (result.bool) {
            player.respond(result.cards, 'highlight', 'qiangyun', 'noOrdering');
          } else {
            event.finish();
            return;
          }

          'step 2'
          player.gain(trigger.player.judging[0], 'gain2');
          trigger.player.judging[0] = result.cards[0];
          trigger.orderingCards.addArray(result.cards);
          game.log(trigger.player, '的判定牌改为', result.cards[0]);
        }
      },
      jiahu: {
        audio: false,
        trigger: {global: ['chooseToRespondBegin', 'chooseToUseBegin']},
        filter: function(event, player) {
          if (event.responded) return false;
          if (!event.filterCard || !event.filterCard({name: 'shan'}, event.player, event)) return false;
          if (event.name == 'chooseToRespond' && !lib.filter.cardRespondable({name: 'shan'}, event.player, event)) return false;
          return event.player.isDamaged() && player.distanceTo(event.player) <= 1 && event.player.hasEmptySlot(2);
        },
        check: function(event, player) {
          return get.attitude(player, event.player) > 0;
        },
        content: function() {
          'step 0'
          trigger.player.judge(card => {
            if (get.color(card) == 'red') return 1.5;
            return -0.5;
          }).set('judge2', result => result.bool);

          'step 1'
          if (result.judge > 0) {
            trigger.untrigger();
            trigger.set('responded', true);
            trigger.result = {bool: true, card: {name: 'shan', isCard: true}};
          }
        }
      },

      // 铃仙·优昙华院·因幡
      xianbo: {
        audio: false,
        enable: 'phaseUse',
        usable: 1,
        filter: function(event, player) {
          return player.countCards('h') > 0;
        },
        filterCard: function(card, player) {
          return true;
        },
        check: function(card) {
          var player = get.owner(card);
          var next = player.getNext();
          var judges = next.getCards('j');
          for (var i = 0; i < judges.length; i++) {
            var judge = get.judge(judges[i]);
            if (judge(card) * get.sgnAttitude(player, next) > 0) {
              return 10 - get.value(card);
            }
          }
          var threshold = 0;
          if (player.countCards('h') <= player.maxHp && game.hasPlayer(p => get.attitude(player, p) < 0 && p.countCards('h') > 0))
            threshold += 8;
          else if (judges.length > 0) return 0;
          if (get.attitude(player, next) > 0 && get.value(card, next) > get.value(card, player)) threshold += 4;
          if (get.attitude(player, next) < 0 && get.value(card, next) < 0) threshold += 4;
          return threshold - get.value(card);
        },
        discard: false,
        prepare: function(cards, player) {
          player.lose(cards, ui.cardPile, 'insert');
          game.broadcastAll(p => {
            var cardx = ui.create.card();
            cardx.classList.add('infohidden');
            cardx.classList.add('infoflip');
            p.$throw(cardx, 1000, 'nobroadcast');
          }, player);
          game.log(player, '将一张手牌置于牌堆顶');
        },
        content: function() {
          'step 0'
          if (player.countCards('h') < player.maxHp) {
            player.chooseTarget(1, false, `###弦波###你可以获得一名其他角色一张手牌`, (card, player, target) => {
              return target != player && target.countCards('h') > 0;
            })
              .set('ai', target => {
                return -get.attitude(player, target) / target.countCards('h');
              });
          } else {
            return;
          }

          'step 1'
          if (result.bool) {
            var target = result.targets[0];
            player.line(target, 'green');
            player.gainPlayerCard(target, 'h', 1, true, `弦波：选择并获得${get.translation(target)}的一张手牌`);
          }
        },
        mod: {
          aiOrder: function(player, card, num) {
            if (card.name == 'tao') return num + 2;
          }
        },
        ai: {
          order: 2,
          result: {
            player: function(player) {
              if (player.countCards('h') <= player.maxHp && game.hasPlayer(p => get.attitude(player, p) < 0 && p.countCards('h') > 0))
                return 2;
              var next = player.getNext();
              var judges = next.getCards('j');
              for (var i = 0; i < judges.length; i++) {
                var judge = get.judge(judges[i]);
                if (player.countCards('h', card => judge(card) * get.sgnAttitude(player, next) > 0) > 0) {
                  return 1;
                }
              }
              if (judges.length > 0) return -1;
              return 0.5;
            }
          }
        }
      },
      huanni: {
        audio: false,
        trigger: {player: 'damageEnd'},
        filter: function(event, player) {
          return player.countCards('h') > 0 && event.source && event.source.isAlive();
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseCard('h', 1, false, get.prompt2('huanni'), card => get.color(card) == 'red')
            .set('ai', card => 1);

          'step 1'
          if (result.bool) {
            player.showCards(result.cards);
            trigger.source.chooseToDiscard('h', 2, false, `###${get.translation(player)}发动了【幻睨】###请弃置两张红色手牌，否则令${get.translation(player)}摸两张牌`, card => get.color(card) == 'red')
              .set('ai', card => {
                if (get.attitude(trigger.source, player) > 0) return -1;
                return 5 - get.value(card, trigger.source);
              });
          } else {
            event.finish();
            return;
          }

          'step 2'
          if (!result.bool) {
            player.draw(2);
          }
        },
        ai: {
          maixie: true,
          maixie_hp: true
        }
      },

      // 蕾米莉亚·斯卡雷特
      shiling: {
        audio: false,
        trigger: {player: 'useCard'},
        filter: function(event, player) {
          return event.targets && event.targets.length == 1 && event.targets[0] != player && event.targets[0].isAlive() && !player.isTurnedOver() && (get.type(event.card) == 'trick' || event.card.name == 'sha');
        },
        check: function(event, player) {
          var target = event.targets[0];
          if (get.attitude(player, target) >= 0) return false;
          if (event.card.name == 'duxin') return false;
          if (target.identity == 'zhu' || (player.getEnemies().length == 1 && player.getEnemies()[0] == target)) {
            var tags = get.info(event.card).ai.tag || {};
            if (tags.damage >= target.getHp()) return true;
          }
          if (player.getHp() == 1 && player.getCards('h').every(c => ['tao', 'jiu'].includes(c.name))) return false;

          var nulls = 0;
          game.players.forEach(p => {
            if (get.attitude(p, target) > 0) nulls += p.getKnownCards(player, 'wuxie', true).length;
            else if (get.attitude(p, target) < 0) nulls -= p.getKnownCards(player, 'wuxie', true).length;
          });
          if (get.type(event.card) == 'trick' && nulls > 0) return true;

          if (event.card.name == 'sha') {
            if (target.getKnownCards(player, 'shan', true).length > 0 || target.getUnknownNum(player, true) >= 2)
              return true;
            var damage = {card: event.card, num: 1};
            damage = player.calcDamage(player, target, damage);
            if (damage.num > Math.min(1, target.getHp()) && target.getUnknownNum(player, true) > 0) return true;
          } else if (event.card.name == 'juedou') {
            if (target.getKnownCards(player, 'sha', true).length + target.getUnknownNum(player, true) / 3 > player.countCards('hm', 'sha')) return true;
          }

          return false;
        },
        content: function() {
          player.turnOver();
          trigger.directHit.addArray(game.players);
        },
        group: 'shiling_turned',
        subSkill: {
          turned: {
            audio: false,
            trigger: {target: 'useCardToTargeted'},
            filter: function(event, player) {
              return event.targets.length == 1 && player.isTurnedOver() && player.countCards('h') > 0 && (get.type(event.card) == 'trick' || event.card.name == 'sha');
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseToDiscard('h', 1, false, `###${get.prompt('shiling')}###你可以弃置一张手牌，令此${get.translation(trigger.card)}对你无效`)
                .set('ai', card => {
                  if (player.countCards('h') == 1) {
                    if (player.getHp() == 1 && player.isTurnedOver()) return -1;
                    var tags = get.info(trigger.card).ai.tag || {};
                    if (trigger.card.name == 'sha' && card.name != 'shan') return 20;
                    else if (trigger.card.name == 'juedou' && card.name != 'wuxie' && (card.name != 'sha' || trigger.player.getKnownCards(player, 'sha', true).length + trigger.player.getUnknownNum(player, true) >= 1))
                      return 20;
                    else if (trigger.card.name == 'nanman' && !['sha', 'wuxie'].includes(card.name)) return 20;
                    else if (trigger.card.name == 'wanjian' && !['shan', 'wuxie'].includes(card.name)) return 20;
                    else if (trigger.card.name == 'huogong' && card.name != 'wuxie' && trigger.player.getKnownCards(player, c => get.suit(c) == get.suit(card)).length + trigger.player.getUnknownNum(player) / 2 >= 1)
                      return 20;
                    else if (tags.loseCard && player.hasKeyEquip()) return 8 - get.value(card);
                    return -1;
                  }

                  if (trigger.card.name == 'nanman' && !['sha', 'wuxie'].includes(card.name)) return 20 - get.value(card);
                  else if (trigger.card.name == 'wanjian' && !['shan', 'wuxie'].includes(card.name)) return 20 - get.value(card);

                  if (get.attitude(player, trigger.player) > 0) return -1;

                  var tags = get.info(trigger.card).ai.tag || {};
                  if (trigger.card.name == 'sha' && !trigger.player.getEquip('guanshi') && !trigger.player.getEquip('qinglong') && player.countCards('hm', 'shan') > 0)
                    return -1;
                  if (trigger.card.name == 'juedou' && player.countCards('hm', 'sha') > trigger.player.getKnownCards(player, 'sha', true).length + trigger.player.getUnknownNum() / 2)
                    return -1;
                  if (trigger.card.name == 'duxin') return -1;
                  if (tags.loseCard && !player.hasKeyEquip() && player.countCards('hm', 'tao') == 0 && (player.getDefense() > 5 || player.countCards('hm', 'jiu') == 0))
                    return -1;

                  return 10 - get.value(card);
                });

              'step 1'
              if (result.bool) {
                player.logSkill('shiling');
                trigger.excluded.add(player);
                game.log(trigger.card, '对', player, '无效');
              }
            }
          }
        }
      },
      xuewang: {
        audio: false,
        trigger: {player: 'loseAfter', global: 'loseAsyncAfter'},
        forced: true,
        filter: function(event, player) {
          if (player.hasSkill('xuewang_blocker')) return false;
          if (event.getlx === false) return false;
          var evt = event.getl(player);
          if (!evt || !evt.cards2) return false;
          // if (player == _status.currentPhase) return false;
          return evt.cards2.filter(c => c.original == 'h').length > 0 && player.countCards('h') == 0;
        },
        content: function() {
          'step 0'
          player.draw(player.maxHp);
          player.addTempSkill('xuewang_blocker');

          'step 1'
          if (player.isTurnedOver()) {
            player.chooseControl(['是', '否']).set('prompt', '是否发动“血妄”翻面并失去1点体力？').set('ai', () => {
              const handNum = player.countCards('h', 'tao');
              const muniuNum = player.countCards('m', 'tao');
              const num = handNum + muniuNum;
              if (num + player.getHp() <= 2) return '否';
              if (handNum === 1 && muniuNum === 0 && player.countCards('h') === 1 && player.getHp() <= 2) return '否';
              return '是';
            });
          } else {
            event.finish();
            return;
          }

          'step 2'
          if (result.control === '是') {
            player.turnOver();
            player.loseHp(1);
          }
        },
        group: ['xuewang_maxcards'],
        subSkill: {
          maxcards: {
            mod: {
              maxHandcard: function(player, num) {
                return Math.max(...game.players.map(p => p.getHp()));
              }
            }
          },
          blocker: {charlotte: true}
        }
      },

      // 芙兰朵露·斯卡雷特
      wosui: {
        audio: false,
        trigger: {player: ['useCard', 'respond']},
        filter: function(event, player) {
          return player != _status.currentPhase && _status.currentPhase && get.itemtype(event.cards) == 'cards' && player.getHp() <= _status.currentPhase.getHp() && _status.currentPhase.countCards('he') > 0;
        },
        check: function(event, player) {
          return get.attitude(player, _status.currentPhase) < 0;
        },
        content: function() {
          'step 0'
          if (player != game.me && !player.isOnline) game.delayx();
          event.times = 2;

          'step 1'
          var prompt = event.times == 2 ? `握碎：请弃置${get.translation(_status.currentPhase)}一张牌` : `握碎：请再弃置${get.translation(_status.currentPhase)}一张牌`;
          event.times--;
          player.discardPlayerCard(_status.currentPhase, 'he', 1, true, prompt);

          'step 2'
          if (event.times > 0 && _status.currentPhase.countCards('he') > 0) {
            event.goto(1);
          }
        }
      },
      heiyan: {
        audio: false,
        enable: 'phaseUse',
        filter: function(event, player) {
          return player.countCards('h', c => get.color(c) == 'black') > 0;
        },
        selectCard: [1, Infinity],
        filterCard: function(card, player) {
          return get.color(card) == 'black';
        },
        selectTarget: [1, Infinity],
        filterTarget: function(card, player, target) {
          return ui.selected.targets.length < ui.selected.cards.length;
        },
        filterOk: function() {
          return ui.selected.cards.length > 0 && ui.selected.targets.length == ui.selected.cards.length;
        },
        unique: true,
        mark: true,
        limited: true,
        check: function(card) {
          var player = get.owner(card);

          var total_neutrals = game.players.filter(p => get.attitude(player, p) == 0 && !(p.identity == 'zhu' && player.identity == 'nei')).length;
          if (total_neutrals > 0) return -1;

          var total_enemies = game.players.filter(p => get.attitude(player, p) < 0).length;
          if (total_enemies == 0) return -1;
          if (ui.selected.cards.length >= total_enemies) return -1;

          if (player.getHp() + player.countCards('hm', 'tao') <= 1) return 10 - get.value(card);

          var total_weaks = game.players.filter(p => get.attitude(player, p) < 0 && p.getDefense() <= 5).length;
          // if (total_weaks < total_enemies / 2) return -1;

          var blacks = player.countCards('h', c => get.color(c) == 'black');
          var threshold = Math.min(Math.max(blacks, total_weaks), total_enemies) / total_enemies * 10;
          return threshold - get.value(card);
        },
        contentBefore: function() {
          player.awakenSkill('heiyan');
        },
        content: function() {
          'step 0'
          if (target.countCards('he') > 0) {
            player.gainPlayerCard(target, 'he', 1, true, `黑炎：获得${get.translation(target)}的一张牌`);
          }
          
          'step 1'
          target.damage(player, 1, 'fire');
        },
        intro: {
          content: 'limited'
        },
        ai: {
          order: 7.3,
          result: {
            target: function(player, target) {
              return -Math.abs(get.attitude(player, target)) / Math.abs(0.5, target.getDefense());
            }
          }
        }
      },

      // 帕秋莉·诺蕾姬
      shengyao: {
        audio: false,
        trigger: {player: ['enterGame', 'phaseZhunbeiBegin', 'damageEnd'], global: 'phaseBefore'},
        forced: true,
        filter: function(event, player) {
          if (event.name == 'phaseZhunbei') return player.countShengyaoMarks() < 4;
          if (event.name == 'damage') return event.num > 0;
          return event.name == 'enterGame' || game.phaseNumber == 0;
        },
        content: function() {
          'step 0'
          event.times = 1;
          if (trigger.name == 'enterGame' || (trigger.name == 'phase' && game.phaseNumber == 0)) event.times = 2;
          else if (trigger.name == 'damage') event.times = trigger.num;

          'step 1'
          event.times--;
          var all_options = ['火', '水', '木', '金', '土'];
          if (trigger.name == 'damage') all_options.push('日', '月');
          var options = all_options.shuffle();
          if (trigger.name != 'enterGame') options = options.sample(3);
          var mark_skills = {
            '火': '【燃灰】其他角色的结束阶段，你可以弃置三张牌并弃置一个“火”标记，然后对其造成1点火焰伤害。',
            '水': '【湖葬】当你对一名其他角色造成伤害后，可以弃置一个“水”标记，然后你弃置其一张牌。',
            '木': '【角笛】当一名角色因弃置而失去至少X张牌时，你可以弃置一个“木”标记并令其回复1点体力(X为该角色体力值)。',
            '金': '【点金】出牌阶段，你可以弃置一个“金”标记并重铸一张手牌，然后你本回合手牌上限+1。',
            '土': '【震垒】结束阶段，你可以弃置一张手牌并弃置一个“土”标记并秘密指定一名角色。直到你的下个回合开始前，每当该角色受到一次伤害时，伤害来源须弃置一张手牌(没有则不弃)并选择一项：1.翻面；2.防止此伤害。',
            '日': '【皇炎】出牌阶段开始时，你可以弃置一个“日”标记并与一名其他角色拼点：若你赢，你对其造成1点火焰伤害；若你没赢，你与其各摸一张牌。',
            '月': '【静月】其他角色使用【杀】或普通锦囊牌指定你为目标后，你可以弃置一个“月”标记并令此牌对至少一名目标无效，然后此牌使用者摸一张牌。'
          };
          player.chooseControl(...options)
            .set('prompt', `###圣曜：请选择并获得一个标记###${options.map(mark => `${mark}：${mark_skills[mark]}`).join('###')}`)
            .set('ai', () => {
              var mark_suffixes = {'火': 'fire', '水': 'water', '木': 'wood', '金': 'gold', '土': 'earth', '日': 'sun', '月': 'moon'};
              if (!player.awakenedSkills.includes('xianshi')) {
                for (var i = 0; i < options.length; ++i) {
                  var mark = options[i];
                  if (player.countMark(`shengyao_${mark_suffixes[mark]}`) == 0)
                    return i;
                }
              }

              var weak = game.findPlayer(p => p.getDefense() <= 5 && get.attitude(player, p) > 0);
              if (weak) {
                if (player == _status.currentPhase && weak.identity != 'zhu') {
                  var index = options.indexOf('土');
                  if (index >= 0) return index;
                }
                if (weak.isDamaged()) {
                  var index = options.indexOf('木');
                  if (index >= 0) return index;
                }
                var index = options.indexOf('月');
                if (index >= 0) return index;
              }

              if (player.getDefense() <= 6 || player.countCards('h') <= 2) {
                var index = options.indexOf('月');
                if (index >= 0) return index;
                var saves = player.countCards('h', c => ['shan', 'tao', 'jiu'].includes(c.name));
                if (saves < player.getEnemies().length / 2) {
                  var index = options.indexOf('金');
                  if (index >= 0) return index;
                }
              }

              var weak_enemy = game.findPlayer(p => {
                if (get.attitude(player, p) >= 0) return false;
                if (!player.canCompare(p)) return false;
                if (p.getHp() > 2 && p.countCards('h') > player.countCards('h') + 2) return false;
                var max = Math.max(...player.getCards('h').map(c => get.number(c)));
                var known_max = Math.max(...p.getKnownCards(player).map(c => get.number(c)));
                var unknown_num = p.getUnknownNum(player);
                var unknown_max = Math.floor(13 * unknown_num / (unknown_num + 1));
                var target_max = Math.max(known_max, unknown_max);
                if (max <= target_max) return false;
                var damage = {num: 1, nature: 'fire'};
                damage = player.calcDamage(player, p, damage);
                if (damage.num == 0) return false;
                return damage.num >= p.getHp() || (damage.num == p.getHp() - 1 && p.countCards('hm') <= 3) || p.countCards('hm') <= 2;
              });
              if (weak_enemy) {
                var index = options.indexOf('日');
                if (index >= 0) return index;
              }

              if (player.countCards('h') > player.getHandcardLimit() + 1) {
                var index = options.indexOf('金');
                if (index >= 0) return index;
              }

              var rest_num = Math.min(player.getHandcardLimit(), player.countCards('h') + 2) + player.countCards('e');
              weak_enemy = game.findPlayer(p => {
                if (get.attitude(player, p) >= 0) return false;
                var damage = {num: 1, nature: 'fire'};
                damage = player.calcDamage(player, p, damage);
                if (damage.num >= p.getHp())
                  return true;
                return false;
              });
              if (weak_enemy && rest_num >= ((weak_enemy.identity == 'zhu' || player.getEnemies().length == 1) ? 3 : 4)) {
                var index = options.indexOf('火');
                if (index >= 0) return index;
              }

              weak_enemy = game.findPlayer(p => {
                if (get.attitude(player, p) >= 0) return false;
                var damage = {num: 1, nature: 'fire'};
                damage = player.calcDamage(player, p, damage);
                if (damage.num > 1 || (p.countCards('hm') <= 2 && damage.num == p.getHp() - 1))
                  return true;
                return false;
              });
              if (weak_enemy && rest_num >= 5) {
                var index = options.indexOf('火');
                if (index >= 0) return index;
              }

              var index = options.indexOf('水');
              if (index >= 0) return index;

              return 0;
            });
          
          'step 2'
          var mark = result.control;
          var mark_suffixes = {'火': 'fire', '水': 'water', '木': 'wood', '金': 'gold', '土': 'earth', '日': 'sun', '月': 'moon'};
          var skill_name = `shengyao_${mark_suffixes[mark]}`;
          player.addMark(skill_name, 1);
          if (!player.hasSkill(skill_name)) player.addSkill(skill_name);
          if (mark == '金') {
            player.logSkill('shengyao_gold');
            player.draw();
          }

          'step 3'
          if (event.times > 0) event.goto(1);
        },
        mark: true,
        marktext: '曜',
        intro: {
          name: '圣曜标记统计',
          content: function(storage, player) {
            var mark_names = {fire: '火', water: '水', wood: '木', gold: '金', earth: '土', sun: '日', moon: '月'};
            var suffixes = ['fire', 'water', 'wood', 'gold', 'earth', 'sun', 'moon'].filter(suffix => player.countMark(`shengyao_${suffix}`) > 0);
            if (suffixes.length == 0) return '无圣曜标记';
            return suffixes.map(suffix => `${mark_names[suffix]}：${player.countMark(`shengyao_${suffix}`)}个`).join('<br>');
          },
          markcount: function(storage, player) {
            return ['fire', 'water', 'wood', 'gold', 'earth', 'sun', 'moon'].reduce((sum, suffix) => sum + player.countMark(`shengyao_${suffix}`), 0);
          }
        },
        subSkill: {
          fire: {
            audio: false,
            trigger: {global: 'phaseJieshuBegin'},
            filter: function(event, player) {
              return player.countMark('shengyao_fire') > 0 && player != event.player && player.countCards('he') >= 3;
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseToDiscard('he', 3, false, `###是否对${get.translation(trigger.player)}发动【燃灰】？###${lib.translate.shengyao_fire_info}`)
                .set('ai', card => {
                  if (get.attitude(player, trigger.player) >= 0) return -1;
                  var damage = {num: 1, nature: 'fire'};
                  damage = player.calcDamage(player, trigger.player, damage);
                  if (damage.num >= trigger.player.getHp()) return 10 - get.value(card);
                  if (!player.awakenedSkills.includes('xianshi')) return -1;
                  if (damage.num == trigger.player.getHp() - 1) return 6 - get.value(card);
                  return 3 - get.value(card);
                });

              'step 1'
              if (result.bool) {
                player.logSkill('shengyao_fire', trigger.player);
                player.removeMark('shengyao_fire', 1);
                if (player.countMark('shengyao_fire') == 0) player.removeSkill('shengyao_fire');
                trigger.player.damage(player, 1, 'fire');
              }
            },
            // marktext: '火',
            // intro: {
            //   name: '火（圣曜）',
            //   name2: '火',
            //   content: '拥有技能【燃灰】'
            // }
          },
          water: {
            audio: false,
            trigger: {source: 'damageEnd'},
            filter: function(event, player) {
              return player.countMark('shengyao_water') > 0 && player != event.player && event.player.countCards('he') > 0;
            },
            prompt: function(event, player) {
              return get.prompt2('shengyao_water', event.player);
            },
            check: function(event, player) {
              if (get.attitude(player, event.player) > 0 && event.player.identity == 'zhu' && event.player.getDefense() <= 5 && event.player.isDamaged() && event.player.getEquip('baiyin'))
                return true;
              if (!player.awakenedSkills.includes('xianshi')) return false;
              if (get.attitude(player, event.player) > 0 && event.player.getDefense() <= 5 && event.player.isDamaged() && event.player.getEquip('baiyin'))
                return true;
              return get.attitude(player, event.player) < 0;
            },
            content: function() {
              player.removeMark('shengyao_water', 1);
              if (player.countMark('shengyao_water') == 0) player.removeSkill('shengyao_water');
              player.discardPlayerCard(trigger.player, 'he', 1, true);
            },
            // marktext: '水',
            // intro: {
            //   name: '水（圣曜）',
            //   name2: '水',
            //   content: '拥有技能【湖葬】'
            // }
          },
          wood: {
            audio: false,
            trigger: {global: 'loseAfter'},
            filter: function(event, player) {
              if (player.countMark('shengyao_wood') == 0) return false;
              if (event.type != 'discard') return false;
              if (!event.player.isDamaged() || !event.player.isAlive()) return false;
              var cards = event.cards.filter(c => c.original != 'j' && get.position(c, true) == 'd');
              return cards.length >= event.player.getHp();
            },
            prompt: function(event, player) {
              return get.prompt2('shengyao_wood', event.player);
            },
            check: function(event, player) {
              if (get.attitude(player, event.player) > 0 && (event.player.identity == 'zhu' || event.player == player || player.getFriends().length <= 1) && event.player.getHp() == 1)
                return true;
              if (!player.awakenedSkills.includes('xianshi')) return false;
              return get.attitude(player, event.player) > 0;
            },
            content: function() {
              player.removeMark('shengyao_wood', 1);
              if (player.countMark('shengyao_wood') == 0) player.removeSkill('shengyao_wood');
              trigger.player.recover(player, 1);
            },
            // marktext: '木',
            // intro: {
            //   name: '木（圣曜）',
            //   name2: '木',
            //   content: '拥有技能【角笛】'
            // }
          },
          gold: {
            audio: false,
            enable: 'phaseUse',
            filter: function(event, player) {
              return player.countMark('shengyao_gold') > 0 && player.countCards('h') > 0;
            },
            filterCard: true,
            discard: false,
            lose: false,
            delay: false,
            check: function(card) {
              var player = get.owner(card);
              var forbid = ['tao', 'jiu', 'wuzhong', 'duxin', 'tiesuo', 'shunshou', 'yaoshan'];
              if (player.countCards('hm', 'shan') <= 1) forbid.push('shan');
              if (player.getHp() + player.countCards('hm', c => forbid.includes(c.name)) <= 3 && !forbid.includes(card.name))
                return 8 - get.value(card);
              if (!player.awakenedSkills.includes('xianshi')) return -1;
              return 6 - get.value(card);
            },
            content: function() {
              player.removeMark('shengyao_gold', 1);
              if (player.countMark('shengyao_gold') == 0) player.removeSkill('shengyao_gold');
              player.recast(cards);
              player.addMark('shengyao_gold_maxcards', 1, false);
              player.addTempSkill('shengyao_gold_maxcards');
            },
            // marktext: '金',
            // intro: {
            //   name: '金（圣曜）',
            //   name2: '金',
            //   content: '拥有技能【点金】'
            // },
            ai: {
              order: 9
            }
          },
          gold_maxcards: {
            mod: {
              maxHandcard: function(player, num) {
                return num + player.countMark('shengyao_gold_maxcards');
              }
            },
            onremove: function(player) {
              player.clearMark('shengyao_gold_maxcards', false);
            }
          },
          earth: {
            audio: false,
            trigger: {player: 'phaseJieshuBegin'},
            filter: function(event, player) {
              return player.countMark('shengyao_earth') > 0 && player.countCards('h') > 0;
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseToDiscard('h', 1, false, get.prompt2('shengyao_earth'))
                .set('ai', card => {
                  var friends = game.filterPlayer(p => get.attitude(player, p) > 0).sort((a, b) => a.getDefense() - b.getDefense());
                  if (friends.length == 0) return -1;
                  if (friends.some(friend => (friend.getDefense() <= 4 || friend.getHp() <= 1) && (friend.identity == 'zhu' || player.getFriends().length <= 1 || friend == player)))
                    return 7 - get.value(card);
                  if (!player.awakenedSkills.includes('xianshi')) return -1;
                  if (friends.some(friend => friend.getDefense() <= 5 || friend.getHp() == 1))
                    return 7 - get.value(card);
                  return 5 - get.value(card);
                });

              'step 1'
              if (!result.bool) {
                event.finish();
                return;
              }
              player.logSkill('shengyao_earth');
              player.removeMark('shengyao_earth', 1);
              if (player.countMark('shengyao_earth') == 0) player.removeSkill('shengyao_earth');
              player.chooseTarget(1, true, `震垒：请选择要保护的目标`, (card, player, target) => true)
                .set('ai', target => {
                  return get.sgnAttitude(player, target) / Math.max(0.5, target.getDefense());
                });

              'step 2'
              var target = result.targets[0];
              target.setMark('shengyao_earth_protect', 1, false);
              player.addTempSkill('shengyao_earth_protect', {player: 'phaseBegin'});
            },
            // marktext: '土',
            // intro: {
            //   name: '土（圣曜）',
            //   name2: '土',
            //   content: '拥有技能【震垒】'
            // }
          },
          earth_protect: {
            audio: false,
            trigger: {global: 'damageBefore'},
            filter: function(event, player) {
              return event.player.countMark('shengyao_earth_protect') > 0 && event.source && event.source.isAlive();
            },
            forced: true,
            charlotte: true,
            content: function() {
              'step 0'
              player.logSkill('shengyao_earth', trigger.source);
              if (trigger.source.countCards('h') > 0)
                trigger.source.chooseToDiscard('h', 1, true, `震垒：请弃置一张手牌`);

              'step 1'
              trigger.source.chooseControl('翻面', '防止此伤害')
                .set('prompt', `震垒：请选择一项`)
                .set('ai', () => {
                  if (get.attitude(trigger.source, trigger.player) >= 0) return 1;
                  if (trigger.num >= trigger.player.getHp()) return 0;
                  if (trigger.player.getDefense() <= trigger.source.getDefense()) return 0;
                  return 1;
                });
              
              'step 2'
              if (result.index == 0) {
                trigger.source.turnOver();
              } else {
                trigger.cancel();
              }
            },
            onremove: function(player) {
              game.players.forEach(p => p.clearMark('shengyao_earth_protect', false));
            }
          },
          sun: {
            audio: false,
            trigger: {player: 'phaseUseBegin'},
            filter: function(event, player) {
              return player.countMark('shengyao_sun') > 0 && game.hasPlayer(p => player.canCompare(p));
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseTarget(1, false, get.prompt2('shengyao_sun'), (card, player, target) => player.canCompare(target))
                .set('ai', target => {
                  if (get.attitude(player, target) >= 0) return -1;
                  var cards = player.getCards('h', c => get.value(c) <= 6);
                  if (cards.length == 0) return -1;
                  var max = Math.max(...cards.map(c => get.number(c)));
                  var known_max = Math.max(...target.getKnownCards(player).map(c => get.number(c)));
                  var unknown_num = target.getUnknownNum(player);
                  var unknown_max = Math.floor(13 * unknown_num / (unknown_num + 1));
                  var target_max = Math.max(known_max, unknown_max);
                  if (max <= target_max) return -1;
                  var damage = {num: 1, nature: 'fire'};
                  damage = player.calcDamage(player, target, damage);
                  return damage.num / Math.max(0.5, target.getDefense());
                });

              'step 1'
              if (!result.bool) {
                event.finish();
                return;
              }
              player.removeMark('shengyao_sun', 1);
              if (player.countMark('shengyao_sun') == 0) player.removeSkill('shengyao_sun');
              var target = result.targets[0];
              event.target = target;
              player.chooseToCompare(target);

              'step 2'
              if (result.bool) {
                event.target.damage(player, 1, 'fire');
              } else {
                player.draw();
                event.target.draw();
              }
            },
            // marktext: '日',
            // intro: {
            //   name: '日（圣曜）',
            //   name2: '日',
            //   content: '拥有技能【皇炎】'
            // }
          },
          moon: {
            audio: false,
            trigger: {target: 'useCardToTargeted'},
            filter: function(event, player) {
              return player.countMark('shengyao_moon') > 0 && event.player && event.player != player && event.player.isAlive() && (event.card.name == 'sha' || get.type(event.card) == 'trick');
            },
            direct: true,
            content: function() {
              'step 0'
              player.chooseTarget([1, Infinity], false, `###${get.prompt('shengyao_moon')}###你可以弃置一个“月”标记，令此${get.translation(trigger.card)}对至少一名目标无效`, (card, player, target) => trigger.targets.includes(target))
                .set('ai', target => {
                  if (['taoyuan', 'wugu'].includes(trigger.card.name)) {
                    return -get.attitude(player, target);
                  } else if (['nanman', 'wanjian'].includes(trigger.card.name)) {
                    return get.attitude(player, target);
                  }
                  if (get.attitude(trigger.player, target) > 0 && get.attitude(player, target) >= 0) return -1;
                  var tags = get.info(trigger.card).ai.tag || {};
                  if (tags.loseCard && (target.hasKeyEquip() || target.getKnownCards(player, c => get.value(c, target) >= 7).length > 0 || (get.attitude(trigger.player, target) > 0 && target.countCards('j') > 0)))
                    return 1;
                  if (tags.gain && (target.hasKeyEquip() || target.getKnownCards(player, c => get.value(c, trigger.player) >= get.value(c, target)).length > 0))
                    return 1;
                  if (tags.damage && tags.damage >= target.getHp() && get.attitude(player, target) > 0)
                    return 1;
                  return -1;
                });

              'step 1'
              if (!result.bool) {
                event.finish();
                return;
              }
              player.logSkill('shengyao_moon', result.targets);
              player.removeMark('shengyao_moon', 1);
              if (player.countMark('shengyao_moon') == 0) player.removeSkill('shengyao_moon');
              trigger.targets.removeArray(result.targets);
              trigger.getParent().triggeredTargets2.removeArray(result.targets);
              trigger.untrigger();
              trigger.player.draw();
            },
            // marktext: '月',
            // intro: {
            //   name: '月（圣曜）',
            //   name2: '月',
            //   content: '拥有技能【静月】'
            // }
          }
        }
      },
      xianshi: {
        audio: false,
        trigger: {player: 'phaseAfter'},
        filter: function(event, player) {
          return player.countMark('shengyao_fire') > 0 && player.countMark('shengyao_water') > 0 && player.countMark('shengyao_wood') > 0 && player.countMark('shengyao_gold') > 0 && player.countMark('shengyao_earth') > 0;
        },
        unique: true,
        mark: true,
        limited: true,
        check: function(event, player) {
          return true;
        },
        content: function() {
          'step 0'
          player.awakenSkill('xianshi');
          for (var mark of ['fire', 'water', 'wood', 'gold', 'earth']) {
            player.removeMark(`shengyao_${mark}`, 1);
            if (player.countMark(`shengyao_${mark}`) == 0) player.removeSkill(`shengyao_${mark}`);
          }
          player.addMark('shengyao_sun', 2);
          if (!player.hasSkill('shengyao_sun')) player.addSkill('shengyao_sun');
          player.addMark('shengyao_moon', 2);
          if (!player.hasSkill('shengyao_moon')) player.addSkill('shengyao_moon');
          player.chooseTarget(1, false, `###贤石###你可以令一名角色增加1点体力上限并回复1点体力`)
            .set('ai', target => {
              if (get.attitude(player, target) <= 0) return -1;
              if (target.identity == 'zhu' && target.getHp() == 1) return 10;
              return 10 / (Math.max(1, target.getHp()) + target.countCards('hm'));
            });

          'step 1'
          if (result.bool) {
            var target = result.targets[0];
            target.gainMaxHp();
            target.recover(player);
          }

          'step 2'
          player.chooseTarget([1, 3], false, `###贤石###你可以令至多三名角色各摸两张牌`)
            .set('ai', target => {
              return get.attitude(player, target) / Math.max(0.5, target.getDefense());
            });

          'step 3'
          if (result.bool) {
            for (var target of result.targets) {
              target.draw(2);
            }
          }

          'step 4'
          player.insertPhase();
        }
      },

      // 米斯蒂娅·萝蕾拉
      yemang: {
        mod: {
          targetEnabled: function(card) {
            if (get.type2(card) == 'trick' && get.color(card) == 'black')
              return false;
          }
        }
      },
      hunqu: {
        audio: false,
        trigger: {player: 'phaseUseBegin'},
        filter: function(event, player) {
          return true;
        },
        direct: true,
        content: function() {
          'step 0'
          player.chooseTarget(1, false, get.prompt2('hunqu'), (card, player, target) => target != player || target.isDamaged())
            .set('ai', target => {
              if (get.attitude(player, target) < 0 && (target.identity == 'zhu' || (player.getEnemies().length == 0 && player.getEnemies()[0] == target))) {
                var damage = {num: 1};
                damage = player.calcDamage(player, target, damage);
                if (damage.num >= target.getHp())
                  return 10;
              }
              if (get.attitude(player, target) > 0 && (target.identity == 'zhu' || (player.getFriends(true).length <= 2 && player.getFriends(true).includes(target))) && (target.getDefense() <= 4 || target.getHp() <= 1) && target.isDamaged()) {
                return 10;
              }
              if (get.attitude(player, target) < 0) {
                var damage = {num: 1};
                damage = player.calcDamage(player, target, damage);
                if (damage.num >= target.getHp())
                  return 10;
              }
              if (get.attitude(player, target) > 0 && (target.getDefense() <= 4 || target.getHp() <= 1) && target.isDamaged()) {
                return 10;
              }
              if (get.attitude(player, target) > 0 && !target.isDamaged()) return -1;
              return Math.abs(get.attitude(player, target)) / Math.max(0.5, target.getDefense());
            });

          'step 1'
          if (!result.bool) {
            event.finish();
            return;
          }
          var target = result.targets[0];
          player.logSkill('hunqu', target);
          player.turnOver();
          event.target = target;
          if (!target.isDamaged()) {
            event.directDamage = true;
          } else {
            event.directDamage = false;
            player.chooseControl()
              .set('choiceList', [`弃置${get.translation(target)}一张手牌并对其造成1点伤害`, `令${get.translation(target)}摸一张牌并回复1点体力`])
              .set('ai', () => {
                if (get.attitude(player, target) > 0) return 1;
                return 0;
              });
          }

          'step 2'
          if (event.directDamage || result.index == 0) {
            if (event.target.countCards('h') > 0)
              player.discardPlayerCard(event.target, 'h', 1, true, `魂曲：请弃置${get.translation(event.target)}一张手牌`);
            event.target.damage(player, 1);
          } else if (result.index == 1) {
            event.target.draw();
            event.target.recover(player, 1);
          }
        }
      },

      // 永江衣玖
      citan: {
        audio: false,
        enable: 'phaseUse',
        usable: 1,
        filter: function(event, player) {
          return game.hasPlayer(p => p != player && Math.abs(p.countCards('h') - player.countCards('h')) <= player.getDamagedHp() && p.countCards('h') + player.countCards('h') > 0);
        },
        filterTarget: function(card, player, target) {
          return target != player && Math.abs(target.countCards('h') - player.countCards('h')) <= player.getDamagedHp() && target.countCards('h') + player.countCards('h') > 0;
        },
        selectTarget: 1,
        content: function() {
          'step 0'
          player.swapHandcards(target);

          'step 1'
          if (player.countCards('h') <= target.countCards('h')) {
            target.damage(player, 1, 'thunder');
          }
        },
        mod: {
          aiOrder: function(player, card, num) {
            if (card.name == 'tao') return num + 2;
          }
        },
        ai: {
          order: 3,
          result: {
            target: function(player, target) {
              if (get.attitude(player, target) < 0) {
                if (player.countCards('h', 'tao') > 0) return 1;
                if (player.countCards('h', 'jiu') > 0 && (player.getHp() <= 2 || target.getHp() <= 2))
                  return 1;
                if (player.countCards('h') >= target.countCards('h') && (target.identity == 'zhu' || (player.getEnemies().length == 1 && player.getEnemies()[0] == target))) {
                  var damage = {num: 1, nature: 'thunder'};
                  damage = player.calcDamage(player, target, damage);
                  if (damage.num >= target.getHp()) {
                    return -damage.num * 10 / Math.max(0.5, target.getHp());
                  }
                }
                var target_tao = target.getKnownCards(player, 'tao').length;
                if (target.getHp() <= 2) target_tao += target.getKnownCards(player, 'jiu').length;
                if (target_tao > 0) return -target_tao * 2 / Math.max(0.5, target.getHp());
                if (player.getDefense() <= 6 && target.countCards('h') < player.countCards('h')) {
                  return 1;
                }
                if (player.countCards('h', 'shan') > 0) {
                  if (target.getHp() < Math.min(3, target.threatenersNum()) && target.getKnownCards(player, 'shan').length == 0 && target.getUnknownNum(player) / 2 <= player.countCards('h', 'shan'))
                    return 1;
                  var can_exchange = false;
                  if (player.getHp() >= Math.min(3, player.threatenersNum()))
                    can_exchange = true;
                  else if (target.getKnownCards(player, 'shan').length >= player.countCards('h', 'shan'))
                    can_exchange = true;
                  if (!can_exchange)
                    return 1;
                }
                if (player.getDefense() >= Math.min(7, target.getDefense()) && player.countCards('h') >= target.countCards('h')) {
                  return -1 / (Math.max(0.5, player.countCards('h') - target.countCards('h')) * Math.max(0.5, target.getHp()));
                }
                return -Math.max(0.5, target.countCards('h')) / (Math.max(0.5, player.countCards('h')) * Math.max(0.5, target.getHp()));
              } else if (get.attitude(player, target) > 0) {
                if (target.getDefense() <= 6 && (target.identity == 'zhu' || player.getHp() > Math.min(2, target.getHp())) && player.countCards('h') < target.countCards('h')) {
                  if (player.countCards('h', 'jiu') > target.getKnownCards(player, 'jiu').length)
                    return target.identity == 'zhu' ? 1 : 0.25;
                  if (player.countCards('h', 'jiu') < target.getKnownCards(player, 'jiu').length + (target.mayHave('jiu') ? 1 : 0))
                    return -1;
                  if (player.countCards('h', 'shan') > target.getKnownCards(player, 'shan').length + (target.mayNotHave(player, 'shan') ? 0 : target.getUnknownNum(player) / 3) && !target.hasBaguaEffect())
                    return target.identity == 'zhu' ? 1 : 0.25;
                  if (player.countCards('h', 'shan') > 0 && !target.mayHaveShan(player) && !target.hasBaguaEffect())
                    return target.identity == 'zhu' ? 1 : 0.25;
                }
              }
              return 0;
            }
          }
        }
      }
		},
		characterReplace:{},
		translate:{
      reimu: '博丽灵梦',
      fengmo: '封魔',
      fengmo_info: '出牌阶段，你可以选择一项：1.弃置两张类别相同的手牌；2.失去一张符卡。然后你令一名本回合未成为“封魔”目标的其他角色进行此选择，若其选项与你不同，你不能发动“封魔”直到回合结束。',
      guayu: '卦玉',
      guayu_info: '主公技，其他博丽阵营角色的出牌阶段开始时，其可以交给你一张符卡并摸一张牌。',

      marisa: '雾雨魔理沙',
      xingchen: '星尘',
      xingchen_info: '你使用【杀】对一名其他角色造成伤害后，可以令该角色判定：若结果为黑色，你视为对其攻击范围内另一名本回合未成为【杀】目标的角色使用一张【杀】。',
      sheyue: '射月',
      sheyue_info: '你可以将一张黑桃牌当作【杀】使用或打出。你使用【杀】指定目标或成为【杀】的目标后，若此【杀】不为红色，你可以摸一张牌。',

      suika: '伊吹萃香',
      shantou: '山投',
      shantou_info: '结束阶段，你可以对一名体力值大于你的其他角色造成1点伤害，然后若其手牌数小于你，其摸一张牌。',
      zuiyan: '醉宴',
      zuiyan_info: '每回合限一次，一名角色于其出牌阶段内使用【酒】后，你可以失去1点体力并令其选择一项：1.其获得一张符卡；2.其获得1点醉酒值。',

      yukari: '八云紫',
      jiejie: '结界',
      jiejie_info: '其他角色的出牌阶段开始时，你可以交给其一张手牌并选择一项：<br><font color="#ff33aa">增益结界</font>：令其获得一张符卡，本回合与所有角色距离为1，使用【杀】可以多指定一名目标。<br><font color="#00cc77">限制结界</font>：令其本回合不能对距离大于1的角色使用牌。',
      jiejie_buff: '增益结界',
      jiejie_debuff: '限制结界',

      kyouko: '幽谷响子',
      huiyin: '回音',
      huiyin_info: '其他角色的手牌因弃置而失去时，你可以弃置一张与这些牌中的至少一张牌花色相同的牌，若如此做，该角色摸一张牌。',
      kuopin: '扩频',
      kuopin_info: '锁定技，摸牌阶段，若你的体力值为场上最少或之一，你额外摸一张牌，且你此回合手牌上限+2。',

      kogasa: '多多良小伞',
      donghe: '恫吓',
      donghe_info: '出牌阶段限一次，你可以弃置任意数量的手牌并指定距离X以内的一名其他角色(X为你以此法弃置的手牌数)，该角色选择一项：1.弃置等量的手牌；2.摸一张牌并翻面。',
      yeyu: '夜雨',
      yeyu_info: '每回合限一次，一名角色因弃置而失去不少于你体力值的手牌时，若其中至少有一张黑色牌，你可以令至多X名角色各摸一张牌(X为以此法弃置的黑色牌数量)。',

      yuuka: '风见幽香',
      sihua: '司花',
      sihua_info: '出牌阶段限一次，你可以弃置至少一张花色各不相同的手牌，若如此做，你获得X张符卡，本回合与其他角色距离-X，且你距离1以内的其他角色本回合不能使用或打出这些花色的牌(X为你以此法弃置的牌数)。',
      yishi: '遗世',
      yishi_info: '限定技，一名角色的结束阶段，若你本回合受到过伤害且你体力值为1，你可以摸三张牌，回复1点体力，然后其他角色与你计算距离+2直到你下个回合开始。',

      alice: '爱丽丝',
      diaoou: '吊偶',
      diaoou_info: '游戏开始时，你可以指定一名其他角色成为“吊偶”角色（每当你受到伤害时，你可以弃置一张牌并对“吊偶”角色造成同属性等量伤害；每当你失去体力时，你可以弃置一张牌并令“吊偶”角色失去等量的体力）。结束阶段，你可以更改“吊偶”角色。',
      anji: '暗机',
      anji_info: '每当你因弃置而失去牌时，若其中有梅花牌，你可以摸一张牌；若其中有装备牌，你可以弃置一名其他角色一张牌。',

      sanae: '东风谷早苗',
      kaihai: '开海',
      kaihai_info: '当你受到伤害后，你可以依次执行任意项：1.令一名角色将手牌数弃至其体力值；2.令一名角色将手牌数摸至其已损失体力值。',
      qiji: '奇迹',
      qiji_info: '主公技，其他守矢阵营角色的红色判定牌生效后，其可以令你摸一张牌。',

      kanako: '八坂神奈子',
      yuzhu: '御柱',
      yuzhu_info: '出牌阶段限两次，若你的“柱”少于四张，你可以判定：若你没有与结果花色相同的“柱”，你将此牌作为“柱”置于武将牌上。结束阶段，你可以弃置任意数量的“柱”并根据弃置的数量发动以下效果：<br>一张，你令一名角色摸一张牌；<br>两张，你令一名角色回复1点体力；<br>三张，你令一名角色翻面；<br>四张，你对一名角色造成2点雷电伤害。',

      suwako: '泄矢诹访子',
      jinlun: '金轮',
      jinlun_info: '①锁定技，若你的装备区内没有防具，你即将受到大于1点的伤害时，将此伤害变为1点。<br>②锁定技，当一张防具牌进入你的装备区时，若你的装备区内没有防具牌，你回复1点体力。',
      suiwa: '祟蛙',
      suiwa_info: '当你受到伤害后，你可以判定：若结果为红色，你可以令至多X名角色各摸一张牌(X为你的已损失体力值)；若结果为黑色，你可以移动场上一张牌。',

      aya: '射命丸文',
      daoshe: '盗摄',
      daoshe_info: '出牌阶段限一次，你可以弃置两张牌并令一名有手牌的其他角色选择弃置一至三张手牌，然后若其手牌数大于其体力值，你观看其手牌并可以获得其中一张牌，否则你摸一张牌。',
      fengmi: '风靡',
      fengmi_info: '弃牌阶段开始时，你可以摸一张牌，若如此做，此回合你的手牌上限改为X(X为此回合出牌阶段所有角色因使用、打出或弃置而进入弃牌堆的红色牌总数)。',

      nitori: '河城荷取',
      linshang: '粼殇',
      linshang_info: '摸牌阶段，你可以少摸至少一张牌，然后若你本阶段摸了：一张牌以上，你令一名其他角色弃置一张手牌；零张牌，你视为使用一张基本牌。',
      jiexun: '节汛',
      jiexun_info: '弃牌阶段开始时，若你本回合从牌堆获得的牌少于三张，你可以摸一张牌。你可以重复此流程。',

      shizuha: '秋静叶',
      canye: '残叶',
      canye_info: '锁定技，你使用【杀】结算后，每名体力值不大于你的目标角色须各弃置一张牌。你使用【杀】时，可以额外指定任意名距离1以内的目标。',
      diaofeng: '凋风',
      diaofeng_info: '当一名角色使用牌指定至少两名目标后，你可以令其判定：若结果为黑色，你令其摸一张牌或令其弃置一张手牌。',

      minoriko: '秋穰子',
      tuji: '土祭',
      tuji_info: '出牌阶段限一次，你可以将一张手牌当作【五谷丰登】使用。一名角色使用【五谷丰登】时，你可以摸一张牌，然后你可以为此【五谷丰登】选择起始目标。',
      ganli: '甘醴',
      ganli_info: '锁定技，你的【酒】均视为【桃】。',

      lily: '莉莉白',
      michun: '觅春',
      michun_info: '①一名角色的红色判定牌生效后，你可以令其从弃牌堆获得此判定牌。<br>②当一名角色成为黑色【杀】或黑色普通锦囊牌的唯一目标时，你可以判定：若结果为红色且该角色不为你，你不能再次发动“觅春②”直到本轮结束。',
      huawu: '花舞',
      huawu_info: '出牌阶段限一次，你可以弃置一张红色牌或弃置两张牌，然后选择一项：1.令一名已受伤的角色摸X+1张牌(X为其已损失体力值且至多为3)；2.选择至多两名其他角色，你与这些角色各摸一张牌。',

      satori: '古明地觉',
      xinyan: '心眼',
      xinyan_info: '出牌阶段开始时，或当你受到1点伤害时，你可以视为使用一张【读心术】。',
      fangying: '仿影',
      fangying_info: '其他角色的出牌阶段结束时，若其体力值不小于你，你可以将一张手牌当作以下两张牌之一使用：1.其本阶段使用的第一张基本牌或普通锦囊牌；2.其本阶段使用的最后一张基本牌或普通锦囊牌。',
      jiuju: '旧踞',
      jiuju_info: '主公技，锁定技，其他地底阵营角色的回合内，你与其他角色的距离均视为1。',

      koishi: '古明地恋',
      duannian: '断念',
      duannian_info: '①出牌阶段前，你可以将至少两张手牌置于武将牌上，然后你跳过此回合的出牌阶段。<br>②准备阶段，若你的武将牌上有“断念”牌，你获得之，并获得以下技能直到此回合结束：你在出牌阶段使用【杀】无数量和距离限制，你使用【杀】可额外指定一个目标，且你不能发动“断念①”。',
      xinping: '心屏',
      xinping_info: '锁定技，若你有“断念”牌，你不能成为【诹访决战】【人形操纵】和【读心术】的目标。',

      cirno: '琪露诺',
      bingpu: '冰瀑',
      bingpu_info: '一名你攻击范围内的其他角色的准备阶段，你可以展示一张手牌并令该角色选择一项：1.获得此牌，然后跳过本回合摸牌阶段；2.令你获得其区域内的一张牌。',

      letty: '蕾蒂',
      xuebeng: '雪崩',
      xuebeng_info: '当你受到1点伤害后，你可以摸两张牌，然后将一张手牌置于你的武将牌上，称为“雪”。',
      yaofeng: '妖风',
      yaofeng_info: '准备阶段或结束阶段，你可以弃置一张“雪”，令一名其他角色选择一项：1.弃置一张基本牌；2.失去1点体力。',
      jihan: '积寒',
      jihan_info: '摸牌阶段，你可以少摸一张牌并获得至少一张“雪”，然后若你没有“雪”，你将牌堆顶的一张牌作为“雪”置于武将牌上。',

      doremy: '哆来咪',
      wuwo: '无我',
      wuwo_info: '每回合限一次，一名其他角色使用基本牌或普通锦囊牌指定你为目标时，你可以与其拼点：若你赢，取消此目标；若你没赢，其可以为此牌多指定或少指定一名目标。',
      mingmeng: '明梦',
      mingmeng_info: '锁定技，你的判定牌或你参与拼点双方的拼点牌生效后，你将其置于武将牌上。锁定技，准备阶段，若“明梦”牌数量不小于你的手牌数，你将其分配给任意角色。',

      yamame: '黑谷山女',
      zhangqi: '瘴气',
      zhangqi_info: '当你对其他角色造成伤害时，若你本轮没有对其发动过“瘴气”，你可以令其失去一张符卡，若如此做，则直到你下个回合开始前，该角色受到的伤害视为火焰伤害且+1。',
      zhusi: '蛛丝',
      zhusi_info: '当你回复体力或在摸牌阶段外摸牌时，你可以选择一项：1.令一名未处于连环状态的其他角色横置；2.令一名处于连环状态的其他角色重置，然后你可以弃置其一张牌。',
      
      eika: '戎璎花',
      zhushi: '筑石',
      zhushi_info: '一名角色弃置至少两张牌时，若其中有至少一张红色牌，你可以将其中至多五张牌以任意顺序置于牌堆顶和/或牌堆底。',
      boyao: '薄夭',
      boyao_info: '其他角色的弃牌阶段开始时，若其本回合内造成过伤害，你可以弃置至少一张手牌并令其选择一项：1.令你摸该数量+1张牌；2.其本回合减少等量的手牌上限。',
      zhiwan: '蛭腕',
      zhiwan_info: '锁定技，当你于回合外摸牌时，你须选择从牌堆顶或牌堆底摸牌。',

      komachi: '小野冢小町',
      yiming: '刈命',
      yiming_info: '其他角色的出牌阶段结束时，若其满足下列至少一项，你可以弃置一张牌。若如此做，视为你对其使用了一张【杀】，且若同时满足两项，你摸一张牌。<br>1. 其装备区内的牌数大于你；<br>2. 其本回合使用过黑色牌。',

      kaguya: '蓬莱山辉夜',
      jiunan: '咎难',
      jiunan_info: '每轮限一次，一名其他角色的出牌阶段结束时，若其此阶段内使用基本牌和普通锦囊牌的数量不大于你的已损失体力值，你可以摸一张牌，然后你可以使用一张牌。',
      yuzhi: '玉枝',
      yuzhi_info: '锁定技，你每回合使用的第一张指定其他角色为目标的牌无距离限制。锁定技，每当你对一名攻击范围外的角色造成伤害时，你获得一张符卡。',
      zhuqu: '竹取',
      zhuqu_info: '主公技，锁定技，你的“咎难”改为每轮限X次(X为月面阵营角色数)。',

      tewi: '因幡帝',
      qiangyun: '强运',
      qiangyun_info: '一名角色的判定牌生效前，你可以打出一张点数相等或更大的手牌替换之。',
      jiahu: '加护',
      jiahu_info: '当一名你距离1以内的角色需要打出一张【闪】时，若其已受伤且未装备防具，你可以令其进行一次判定：若结果为红色，视为该角色打出了一张【闪】。',

      reisen: '铃仙',
      xianbo: '弦波',
      xianbo_info: '出牌阶段限一次，你可以将一张手牌置于牌堆顶，然后若你的手牌数小于体力上限，你可以获得一名其他角色一张手牌。',
      huanni: '幻睨',
      huanni_info: '当你受到伤害后，你可以展示一张红色手牌并令伤害来源选择一项：1.弃置两张红色手牌；2.令你摸两张牌。',

      remilia: '蕾米莉亚',
      shiling: '誓灵',
      shiling_info: '当你使用【杀】或普通锦囊牌指定唯一目标后，若你的武将牌正面朝上，你可以翻面并令此牌不可被响应。当你成为【杀】或普通锦囊牌的唯一目标后，若你的武将牌背面朝上，你可以弃置一张手牌并令此牌对你无效。',
      xuewang: '血妄',
      xuewang_info: '①锁定技，你的手牌上限等于所有存活角色体力值中的最大值。<br>②锁定技，每回合限一次，每当你失去最后的手牌时，你将手牌数补至体力上限，然后若你的武将牌背面朝上，你可以翻面并失去1点体力。',

      flandre: '芙兰朵露',
      wosui: '握碎',
      wosui_info: '当你在回合外使用或打出一张牌时，若你的体力值不大于当前回合角色，你可以弃置当前回合角色两张牌。',
      heiyan: '黑炎',
      heiyan_info: '限定技，出牌阶段，你可以弃置至多三张黑色手牌并指定等量的其他角色，你依次获得这些角色一张牌并对其造成1点火焰伤害。',

      patchouli: '帕秋莉',
      shengyao: '圣曜',
      shengyao_info: '①锁定技，游戏开始时，你在火水木金土五种标记中选择两个获得(可以重复)。<br>②锁定技，准备阶段，若你的标记数小于4，你在这些标记的随机三个中选择一个获得。<br>③锁定技，当你受到1点伤害时，你在这些标记和日月标记的随机三个中选择一个获得。',
      shengyao_fire: '燃灰',
      shengyao_fire_info: '其他角色的结束阶段，你可以弃置三张牌并弃置一个“火”标记，然后对其造成1点火焰伤害。',
      shengyao_water: '湖葬',
      shengyao_water_info: '当你对一名其他角色造成伤害后，你可以弃置一个“水”标记，然后你弃置其一张牌。',
      shengyao_wood: '角笛',
      shengyao_wood_info: '当一名角色因弃置而失去至少X张牌时，你可以弃置一个“木”标记并令其回复1点体力(X为该角色体力值)。',
      shengyao_gold: '点金',
      shengyao_gold_info: '①出牌阶段，你可以弃置一个“金”标记并重铸一张手牌，然后你本回合手牌上限+1。<br>②锁定技，当你获得一个“金”标记时，你摸一张牌。',
      shengyao_earth: '震垒',
      shengyao_earth_info: '结束阶段，你可以弃置一张手牌并弃置一个“土”标记并秘密指定一名角色。直到你的下个回合开始前，每当该角色受到一次伤害时，伤害来源须弃置一张手牌(没有则不弃)并选择一项：1.翻面；2.防止此伤害。',
      shengyao_sun: '皇炎',
      shengyao_sun_info: '出牌阶段开始时，你可以弃置一个“日”标记并与一名其他角色拼点：若你赢，你对其造成1点火焰伤害；若你没赢，你与其各摸一张牌。',
      shengyao_moon: '静月',
      shengyao_moon_info: '其他角色使用【杀】或普通锦囊牌指定你为目标后，你可以弃置一个“月”标记并令此牌对至少一名目标无效，然后此牌使用者摸一张牌。',
      xianshi: '贤石',
      xianshi_info: '限定技，你的回合结束后，你可以弃置火水木金土标记各一个。若如此做，你获得2个日标记和2个月标记，令至多一名角色增加1点体力上限并回复1点体力，再令至多三名角色各摸两张牌，然后你进行一个额外的回合。',

      mystia: '米斯蒂娅',
      yemang: '夜盲',
      yemang_info: '锁定技，黑色的锦囊牌对你无效。',
      hunqu: '魂曲',
      hunqu_info: '出牌阶段开始时，你可以翻面并选择一项：1.弃置一名其他角色一张手牌并对其造成1点伤害；2.令一名已受伤角色摸一张牌并回复1点体力。',

      iku: '永江衣玖',
      citan: '磁探',
      citan_info: '出牌阶段限一次，你可以与一名手牌数与你相差不超过X的其他角色交换手牌(你或该角色须至少有一张手牌)，然后若你的手牌数不大于该角色，你对其造成1点雷电伤害(X为你已损失的体力值)。',

      touhou: '东方包',
      thstandard: '东方包·标准'
		},
	};
});
