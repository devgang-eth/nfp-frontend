import {useState} from 'react';
import numeral from 'numeral';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider, IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material';
import {InformationCircleOutlined as InformationCircleOutlinedIcon} from '../../../icons/information-circle-outlined';
import {ArrowRight as ArrowRightIcon} from '../../../icons/arrow-right';
import {Share as ShareIcon} from "../../../icons/share";
import {ExternalLink as ExternalLinkIcon} from "../../../icons/external-link";

const sortTokenList = (tokens, order, orderBasis) => tokens
  .sort((a, b) => {
    if (order === 'asc') {
      return a[orderBasis] < b[orderBasis] ? -1 : 1;
    }

    return a[orderBasis] > b[orderBasis] ? -1 : 1;
  });

export const AccountTokenList = (props) => {
  const [order, setOrder] = useState('desc');
  const [orderBasis, setOrderBasis] = useState('balance');

  const [symbolDirection, setSymbolDirection] = useState('desc');
  const [balanceDirection, setBalanceDirection] = useState('desc');
  const [priceDirection, setPriceDirection] = useState('desc');
  const [valueDirection, setValueDirection] = useState('desc');

  const fungibleTokenList = props.fungibleTokenList;

  const handleSortBySymbol = (orderBasis) => {
    setSymbolDirection(changeOrder(symbolDirection));
    handleSort(orderBasis, symbolDirection);
  };

  const handleSortByBalance = (orderBasis) => {
    setBalanceDirection(changeOrder(balanceDirection));
    handleSort(orderBasis, balanceDirection);
  };

  const handleSortByPrice = (orderBasis) => {
    setPriceDirection(changeOrder(priceDirection));
    handleSort(orderBasis, priceDirection);
  };

  const handleSortByValue = (orderBasis) => {
    setValueDirection(changeOrder(valueDirection));
    handleSort(orderBasis, valueDirection);
  };

  const handleSort = (orderBasis, order) => {
    setOrderBasis(orderBasis);
    setOrder(order);
  };

  const changeOrder = (prevOrder) => {
    if (prevOrder === 'asc') {
      return 'desc';
    }

    return 'asc';
  };

  return (
    <Card {...props}>
      <CardHeader
        title="Token Balance"
        action={(
          <Tooltip title="Refresh rate is 24h">
            <InformationCircleOutlinedIcon sx={{color: 'action.active'}}/>
          </Tooltip>
        )}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active
                direction={symbolDirection}
                onClick={() => handleSortBySymbol('symbol')}
              >
                <Box ml={2}>
                  Symbol
                </Box>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active
                direction={balanceDirection}
                onClick={() => handleSortByBalance('balance')}
              >
                Balance
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active
                direction={priceDirection}
                onClick={() => handleSortByPrice('price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active
                direction={valueDirection}
                onClick={() => handleSortByValue('value')}
              >
                Value
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fungibleTokenList && sortTokenList([...fungibleTokenList], order, orderBasis).map((token) => (
            <TableRow
              key={token.symbol}
              sx={{
                '&:last-child td': {
                  border: 0
                }
              }}
            >
              <TableCell>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                  ml={2}
                >
                  <a href={token.url} target='_blank'>
                    <img
                      style={{display: 'inline-block', verticalAlign: 'middle'}}
                      width={24}
                      height={24}
                      alt={token.symbol}
                      src={token.image}
                    />
                  </a>
                  <Typography
                    sx={{ml: 2}}
                    variant="subtitle2"
                  >
                    {token.symbol}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">
                  {token.balance}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">
                  {(Number(token.price) === 0) ? '-' : token.price}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">
                  {(Number(token.value) === 0) ? '-' : token.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*<Divider />*/}
      {/*<CardActions>*/}
      {/*  <Button*/}
      {/*    endIcon={(*/}
      {/*      <ArrowRightIcon fontSize="small" />*/}
      {/*    )}*/}
      {/*  >*/}
      {/*    See more*/}
      {/*  </Button>*/}
      {/*</CardActions>*/}
    </Card>
  );
};
