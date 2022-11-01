import React from 'react';
import PaginatedContent from '@/components/admin/PaginatedContent';
import { Card } from 'react-bootstrap';
import Backend from '@/components/admin/Backend';
import { adminMenu } from '@/data/admin/sideMenu';
import Button from '@/components/forms/Button';
import { filterTransactions } from '@/utils/filters';
import {
  USER_ROLES,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR,
  TRANSACTION_STATUS_NAME,
} from '@/utils/constants';
import { getShortDate } from '@/utils/date-helpers';
import { Calendar } from 'iconsax-react';
import FormikButton from '@/components/forms/FormikButton';
import DatePicker from '@/components/forms/DatePicker';
import { rescheduleTransactionSchema } from '@/components/forms/schemas/page-schema';
import Modal from '@/components/ui/Modal';

// forms
import axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import {
  getError,
  moneyFormatInNaira,
  statusIsSuccessful,
} from '@/utils/helpers';
import { toast } from 'react-toastify';
import FormikForm from '@/components/forms/FormikForm';
import ProcessButton from '@/components/utils/ProcessButton';

const Transactions = () => (
  <Backend role={USER_ROLES.ADMIN}>
    <PaginatedContent
      endpoint={'api/offline-payments'}
      pageName="Transaction"
      DataComponent={TransactionsRowList}
      PageIcon={<Calendar />}
      populate="*"
      filterFields={filterTransactions}
    />
  </Backend>
);

export const TransactionsRowList = ({ results, offset, attachment, query }) => {
  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ id, attributes }, index) => (
                <TransactionsSingleRow
                  key={index}
                  number={offset + index + 1}
                  id={id}
                  {...attributes}
                  attachment={attachment}
                  query={query}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const TransactionsSingleRow = (transaction) => {
  const { id, number, amount, status, paymentDate, type, query } = transaction;
  return (
    <tr>
      <td>{number}</td>
      <td>{moneyFormatInNaira(amount)}</td>
      <td>{type}</td>
      <td>
        <span
          className={`badge badge-dot text-${TRANSACTION_STATUS_COLOR[status]}`}
        >
          {TRANSACTION_STATUS_NAME[status]}
        </span>
      </td>
      <td>{getShortDate(paymentDate)}</td>
      <td>
        {status.toString() === TRANSACTION_STATUS.PENDING.toString() && (
          <ProcessButton
            afterSuccess={() => query.mutate()}
            api={`offline-payments/${id}`}
            buttonColor={'warning'}
            buttonClassName={'btn-sm'}
            buttonSizeClassName="btn-xs"
            modalTitle="Assign Property"
            data={{ status: TRANSACTION_STATUS.CONFIRMED }}
            modalContent={`Are you sure you want to mark this transaction as verified?`}
            successMessage={`The information has been successfully updated`}
          >
            Verified
          </ProcessButton>
        )}
      </td>
    </tr>
  );
};

export default Transactions;