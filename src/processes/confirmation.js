import { reactive } from 'vue';
import { DeferredBoolean } from '@/utils/utils.js';

export const confirmation = reactive({
  isModalOn: false,
});

export const useConfirmation = () => {
  return confirmation;
};

export let modalPromise;

export function ask() {
  modalOn();
  modalPromise = new DeferredBoolean;

  return modalPromise.promise;
};

export function modalOn() {
  confirmation.isModalOn = true;
};

export function modalOff() {
  confirmation.isModalOn = false;
};

