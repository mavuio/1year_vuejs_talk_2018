<template>
<div class="confirm">
  <h2 class="step-headline">Fotos bearbeiten</h2>
  <div>

    <form @submit.prevent="validateBeforeSubmit">

    <ul class='fotos'>
      <li  v-for="(foto, index) in localFotos">
        <div class='left'>
          <div class="frame">
            <div class="thumbnail" :style="{'background-image':'url('+foto.url+')'}"></div>
            <div>&nbsp;</div><button class="btn btn-sm  btn-danger" @click='removeFoto(foto.file, index)' type="button"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <div class="right">
                <div class="form-group" :class="{'has-error': errors.has('desc'+index) }">
                  <textarea class='form-control' type="text" v-validate="'required|min:10|max:250'" placeholder="Bildbeschreibung: warum schlägt gerade hier dein Herz für die Natur ?" :name="'desc'+index" v-model="foto.desc" data-vv-as="'Bildbeschreibung'"></textarea>
                  <span v-show="errors.has('desc'+index)" class="help-block">{{ errors.first('desc'+index) }}</span>
                </div>
                <div class="form-group" :class="{'has-error': errors.has('place'+index) }">
                  <label class="control-label" for="place">Aufnahmeort des Fotos:</label>
                  <input class='form-control' type="text" v-validate="'required|min:5|max:250'" :name="'place'+index" v-model="foto.place" data-vv-as="'Aufnahmeort des Fotos'">
                  <span v-show="errors.has('place'+index)" class="help-block">{{ errors.first('place'+index) }}</span>
                </div>
        </div>
      </li>
    </ul>

    <button v-if="uploadSlotsLeft>0" class="btn btn-sm" type="button" @click="$router.push('upload');"><i class="fa fa-chevron-left"></i> weitere Fotos hochladen</button>

    <button class="btn btn-nf2 btn-lg pull-right" type="submit"><i class="fa fa-chevron-right"></i> weiter</button>
  </form>




  </div>
</div>
</template>

<script>

import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

import {
  Validator
} from 'vee-validate';
import VeeValidate from 'vee-validate';
import de from 'vee-validate/dist/locale/de';

Vue.use(VeeValidate);
Validator.addLocale(de);
Validator.setLocale('de');

export default {
  name: 'Fotos',
  props: ['submission'],
  data: function() {
    return {
      localFotos: {}
    };
  },
  computed: mapGetters([
    'uploadSlotsLeft',
    'tid',
  ]),
  methods: {
        removeFoto(file,index) {
          if (confirm('dieses Foto entfernen ?')) {
            this.$store.commit('removeFoto',file);
            this.localFotos.splice(index,1);
          }
        },
        validateBeforeSubmit() {
            this.$validator.validateAll().then(() => {
                // eslint-disable-next-line
                this.$store.commit('updateFotos',this.localFotos);
                this.$router.push('submit');
            }).catch(() => {
                // eslint-disable-next-line
                alert('Bitte fülle alle Felder aus !');
            });
        }
    },
  created:function() {
    this.localFotos=this.$store.getters.fotos;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>@import "../styles/settings.scss";

.fotos {
    list-style: none;
    max-width: 600px;
    li {

        position: relative;
        .right {
          margin-left: 120px;
          min-height: 120px;
          small {
            font-weight: normal;
          }
        }
        .left {
          float:left;
        }
        display: block;
        border-bottom: 1px solid #ddd;
        padding: 10px;

        .frame {
            border: 1px solid #ccc;
            padding: 5px;
            width: 110px;
            height: 110px;
            position: relative;
            .thumbnail {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;

            }
        }
    }
}
</style>
