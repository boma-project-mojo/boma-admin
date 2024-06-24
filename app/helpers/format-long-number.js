import { helper } from '@ember/component/helper';

export function formatLongNumber(params /*, hash*/) {
  try {
    var value = params[0];

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.log(error);

    return 0;
  }
}

export default helper(formatLongNumber);
