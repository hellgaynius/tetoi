import { reactive } from 'vue';
import { DeferredBoolean } from '@/utils/utils.js';

export const confirmation = reactive({
  isModalOn: false,
  question: '',
  isTextBig: true,
});

export const useConfirmation = () => {
  return confirmation;
};

export let modalPromise;

export function ask({
    question = 'are you sure?',
    isTextBig = true,
  }) {
  modalOn();
  modalPromise = new DeferredBoolean;
  confirmation.question = question;
  confirmation.isTextBig = isTextBig;

  return modalPromise.promise;
};

export function modalOn() {
  confirmation.isModalOn = true;
};

export function modalOff() {
  confirmation.isModalOn = false;
};

