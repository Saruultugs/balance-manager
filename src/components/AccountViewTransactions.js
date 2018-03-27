import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import lang from '../languages';
import Card from './Card';
import ButtonCustom from './ButtonCustom';
import LineBreak from './LineBreak';
import Blockie from './Blockie';
import AssetIcon from './AssetIcon';
import HoverWrapper from './HoverWrapper';
import TransactionStatus from './TransactionStatus';
import etherscanLogo from '../assets/etherscan-logo.svg';
import ethplorerLogo from '../assets/ethplorer-logo.svg';
import { getLocalTimeDate } from '../helpers/time';
import { colors, fonts, shadows, responsive, transitions } from '../styles';

const StyledGrid = styled.div`
  width: 100%;
  text-align: right;
  position: relative;
  z-index: 0;
  background-color: rgb(${colors.white});
  border-radius: 0 0 8px 8px;
`;

const StyledRow = styled.div`
  width: 100%;
  display: grid;
  position: relative;
  padding: 20px;
  z-index: 0;
  background-color: rgb(${colors.white});
  grid-template-columns: 2fr 1fr 2fr 2fr 2fr;
  min-height: 0;
  min-width: 0;
  & p {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: ${fonts.size.h6};
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  @media screen and (${responsive.sm.max}) {
    grid-template-columns: repeat(5, 1fr);
    padding: 16px;
    & p {
      font-size: ${fonts.size.small};
    }
  }
  @media screen and (${responsive.xs.max}) {
    grid-template-columns: 1fr repeat(3, 3fr);
    & p:nth-child(3) {
      display: none;
    }
  }
`;

const StyledLabelsRow = styled(StyledRow)`
  width: 100%;
  border-width: 0 0 2px 0;
  border-color: rgba(${colors.lightGrey}, 0.4);
  border-style: solid;
  padding: 12px 20px;
  & p:first-child {
    justify-content: flex-start;
  }
  & p:nth-child(2) {
    margin-right: -20px;
  }
`;

const StyledLabels = styled.p`
  text-transform: uppercase;
  font-size: ${fonts.size.small} !important;
  font-weight: ${fonts.weight.semibold};
  color: rgba(${colors.darkGrey}, 0.7);
`;

const StyledTransactionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  z-index: 0;
  & > div {
    transition: ${transitions.base};
    border-radius: 8px;
    @media (hover: hover) {
      &:hover {
        z-index: 10;
        box-shadow: ${({ showTxDetails }) =>
          showTxDetails ? `${shadows.big}` : `${shadows.soft}`};
      }
    }
  }
`;

const StyledTransaction = styled(StyledRow)`
  transition: ${transitions.base};
  width: 100%;
  box-shadow: none;
  & > * {
    font-weight: ${fonts.weight.medium};
    color: ${({ failed }) => (failed ? `rgba(${colors.dark}, 0.3)` : `rgba(${colors.dark}, 0.6)`)};
  }
  & > p:first-child {
    justify-content: flex-start;
  }
  & > p {
    font-family: ${fonts.family.SFMono};
  }
`;

const StyledTransactionMainRow = styled(StyledTransaction)`
  cursor: pointer;
  border-radius: ${({ showTxDetails }) => (showTxDetails ? '8px 8px 0 0' : `8px`)};
  &:nth-child(n + 3) {
    border-top: 1px solid rgba(${colors.darkGrey}, 0.1);
  }
`;

const StyledTransactionDetails = styled(StyledTransaction)`
  transition: ${transitions.long};
  border-top-color: rgba(${colors.darkGrey}, 0.1);
  border-top-style: solid;
  border-top-width: ${({ showTxDetails }) => (showTxDetails ? `1px` : '0')};
  max-height: ${({ showTxDetails }) => (showTxDetails ? '80px' : '0')};
  padding: ${({ showTxDetails }) => (showTxDetails ? '20px' : '0 20px')};
  background-color: rgb(${colors.white});
  overflow: hidden;
  & > div {
    display: flex;
  }
  & p {
    justify-content: flex-start;
  }
`;

const StyledTransactionTopDetails = styled(StyledTransactionDetails)`
  border-radius: 0;
  grid-template-columns: 2fr 1fr 1fr;
`;

const StyledTransactionBottomDetails = styled(StyledTransactionDetails)`
  border-radius: 0 0 8px 8px;
  grid-template-columns: 3fr 1fr;
`;

const StyledLineBreak = styled(LineBreak)`
  border-top: 1px solid rgba(${colors.darkGrey}, 0.1);
  opacity: ${({ showTxDetails }) => (showTxDetails ? '0' : '1')};
`;

const StyledBlockie = styled(Blockie)`
  margin-right: 10px;
`;

const StyledAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  min-height: 0;
  min-width: 0;
  & p {
    font-size: ${fonts.size.medium};
    margin-left: 10px;
  }
  @media screen and (${responsive.xs.max}) {
    & > img {
      margin-left: 12px;
    }
    & p {
      display: none;
    }
  }
`;

const StyledShowMoreTransactions = styled(StyledRow)`
  grid-template-columns: auto;
  min-height: 0;
  min-width: 0;
  width: 100%;
  z-index: 2;
  & div p {
    font-weight: ${fonts.weight.medium};
  }
  & > p {
    font-weight: ${fonts.weight.semibold};
    font-family: ${fonts.family.SFMono};
  }
  & p {
    cursor: pointer;
    text-align: left;
    justify-content: flex-start;
    font-family: ${fonts.family.SFProText};
    font-weight: ${fonts.weight.semibold};
    font-size: ${fonts.size.h6};
    color: rgb(${colors.grey});
  }
  @media (hover: hover) {
    &:hover p {
      opacity: 0.7;
    }
  }
`;

const StyledCard = styled(Card)`
  box-shadow: none;
`;

const StyledMessage = styled.div`
  height: 177px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(${colors.grey});
  font-weight: ${fonts.weight.medium};
`;

class AccountViewTransactions extends Component {
  state = {
    showTxDetails: null,
    limitTransactions: 10
  };
  onShowTxDetails = hash => {
    if (this.state.showTxDetails === hash) {
      this.setState({ showTxDetails: null });
    } else {
      this.setState({ showTxDetails: hash });
    }
  };
  onShowMoreTransactions = () => {
    if (this.state.limitTransactions > this.props.transactions.length) return null;
    this.setState({ limitTransactions: this.state.limitTransactions + 10 });
  };

  render = () => {
    const _transactions = this.props.transactions.filter(tx => !tx.interaction);
    return (
      !!_transactions &&
      (!this.props.fetchingTransactions ? (
        <StyledGrid>
          <StyledLabelsRow>
            <StyledLabels>{lang.t('account.label_asset')}</StyledLabels>
            <StyledLabels>{lang.t('account.label_status')}</StyledLabels>
            <StyledLabels>{lang.t('account.label_quantity')}</StyledLabels>
            <StyledLabels>{lang.t('account.label_price')}</StyledLabels>
            <StyledLabels>{lang.t('account.label_total')}</StyledLabels>
          </StyledLabelsRow>

          {_transactions.map((tx, idx, arr) => {
            if (idx > this.state.limitTransactions) return null;
            return (
              <StyledTransactionWrapper
                showTxDetails={this.state.showTxDetails === tx.hash}
                failed={tx.error}
                key={tx.hash}
              >
                <HoverWrapper hover={this.state.showTxDetails === tx.hash}>
                  <StyledTransactionMainRow
                    showTxDetails={this.state.showTxDetails === tx.hash}
                    onClick={() => this.onShowTxDetails(tx.hash)}
                  >
                    <StyledAsset>
                      <AssetIcon currency={tx.asset.symbol} />
                      <p>{tx.asset.name}</p>
                    </StyledAsset>
                    <TransactionStatus tx={tx} accountAddress={this.props.account.address} />

                    <p>{`${tx.value.display}`}</p>
                    <p>{tx.native ? tx.native.price.display : '———'}</p>
                    <p>
                      {tx.native
                        ? tx.from === this.props.account.address
                          ? tx.native.value.display ? `- ${tx.native.value.display}` : '———'
                          : `${tx.native.value.display || '———'}`
                        : '———'}
                    </p>
                  </StyledTransactionMainRow>
                  <StyledTransactionTopDetails showTxDetails={this.state.showTxDetails === tx.hash}>
                    <div>
                      <StyledBlockie
                        seed={tx.from === this.props.account.address ? tx.to : tx.from}
                      />
                      <div>
                        <p>
                          <strong>{tx.from === this.props.account.address ? 'TO' : 'FROM'}</strong>
                        </p>
                        <p>{tx.from === this.props.account.address ? tx.to : tx.from}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p>
                          <strong>{'FEE'}</strong>
                        </p>
                        <p>{`${tx.txFee.display} (${
                          tx.native ? tx.native.txFee.display : '———'
                        })`}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p>
                          <strong>{'TIMESTAMP'}</strong>
                        </p>
                        <p>{getLocalTimeDate(tx.timestamp.ms)}</p>
                      </div>
                    </div>
                  </StyledTransactionTopDetails>
                  <StyledTransactionBottomDetails
                    showTxDetails={this.state.showTxDetails === tx.hash}
                  >
                    <div>
                      <div>
                        <p>
                          <strong>{'TRANSACTION HASH'}</strong>
                        </p>
                        <p>{tx.hash}</p>
                      </div>
                    </div>

                    <div>
                      <a
                        href={`https://${
                          this.props.web3Network !== 'mainnet' ? `${this.props.web3Network}.` : ''
                        }etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <ButtonCustom left txtColor="etherscan" img={etherscanLogo}>
                          {'Etherscan'}
                        </ButtonCustom>
                      </a>
                      <a
                        href={`https://ethplorer.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <ButtonCustom
                          left
                          disabled={this.props.web3Network !== 'mainnet'}
                          txtColor="ethplorer"
                          img={ethplorerLogo}
                        >
                          {'Ethplorer'}
                        </ButtonCustom>
                      </a>
                    </div>
                  </StyledTransactionBottomDetails>
                </HoverWrapper>
                <StyledLineBreak
                  noMargin
                  showTxDetails={this.state.showTxDetails === tx.hash || idx + 1 === arr.length}
                />
              </StyledTransactionWrapper>
            );
          })}
          {this.state.limitTransactions < _transactions.length && (
            <StyledShowMoreTransactions onClick={this.onShowMoreTransactions}>
              <p>{lang.t('account.show_more')}</p>
            </StyledShowMoreTransactions>
          )}
        </StyledGrid>
      ) : (
        <StyledCard minHeight={280} fetching={this.props.fetchingTransactions}>
          <StyledMessage>{`No transactions found or failed request, please refresh`}</StyledMessage>
        </StyledCard>
      ))
    );
  };
}

AccountViewTransactions.propTypes = {
  transactions: PropTypes.array.isRequired,
  fetchingTransactions: PropTypes.bool.isRequired,
  account: PropTypes.object.isRequired,
  web3Network: PropTypes.string.isRequired
};

const reduxProps = ({ account }) => ({
  transactions: account.transactions,
  fetchingTransactions: account.fetchingTransactions,
  account: account.accountInfo,
  web3Network: account.web3Network
});

export default connect(reduxProps, null)(AccountViewTransactions);
