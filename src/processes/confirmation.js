import { reactive } from 'vue';
import { DeferredBoolean } from '@/utils/utils.js';

export const confirmation = reactive({
  isModalOn: false,
  question: 'are you sure?',
  height: 250,
  fontSize: 40,
});

export const useConfirmation = () => {
  return confirmation;
};

export let modalPromise;

export function ask({
    question = confirmation.question,
    height = confirmation.height,
    fontSize = confirmation.fontSize,
  }) {
  modalOn();
  modalPromise = new DeferredBoolean;
  confirmation.question = question;
  confirmation.height = height;
  confirmation.fontSize = fontSize;

  return modalPromise.promise;
};

export function modalOn() {
  confirmation.isModalOn = true;
};

export function modalOff() {
  confirmation.isModalOn = false;
};

