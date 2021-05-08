import moment from 'moment';
import 'moment/locale/fr';

export const prettyPrintFromNow = (date) => {
  moment.locale('fr');
  const duration = moment(date);

  return duration.fromNow();
};
