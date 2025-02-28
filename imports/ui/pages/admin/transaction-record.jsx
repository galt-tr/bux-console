import bsv from 'bsv';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

import { Alert, Button, TextareaAutosize, Typography } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { useUser } from "../../hooks/user";
import { JsonView } from "../../components/json-view";

export const AdminTransactionRecord = () => {
  const { buxAdminClient } = useUser();
  const location = useLocation();
  const params = new URLSearchParams(location.search)

  const [ txHex, setTxHex ] = useState('');
  const [ transaction, setTransaction ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  useEffect(() => {
    const tx_id = params.get('tx_id');
    if (tx_id) {
      setTxHex(tx_id);
    }
  }, [params]);

  const recordTransaction = useCallback((txHex) => {
    if (txHex) {
      setLoading(true);
      buxAdminClient.RecordTransaction(txHex, null, {}).then(tx => {
        setTransaction(tx);
        setError('');
        setLoading(false);
      }).catch(e => {
        setTransaction(null);
        setError(e.message);
        setLoading(false);
      });
    }
  },[]);

  return (
    <DashboardLayout>
      <Typography
        color="inherit"
        variant="h4"
      >
        Record a Transaction in HEX
      </Typography>
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Empty"
        value={txHex}
        onChange={(e) => setTxHex(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          fontSize: 15,
          fontFamily: 'inherit',
        }}
      />
      <Button
        color="primary"
        variant="contained"
        onClick={async () => {
          await recordTransaction(txHex);
        }}
      >
        Record transaction
      </Button>
      {loading
      ?
        <>Loading...</>
      :
        <>
          {!!error &&
          <Alert severity="error">{error}</Alert>
          }
          {txHex && transaction && <>
            <h2>Bux transaction</h2>
            <JsonView jsonData={transaction} />
            <h2>Bitcoin transaction</h2>
            <JsonView jsonData={(new bsv.Transaction(transaction.hex)).toObject()} />
          </>}
        </>
      }
    </DashboardLayout>
  );
};
