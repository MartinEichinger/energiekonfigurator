import styled from '@emotion/styled';
import { useAppSelector, useAppDispatch } from '../store/hooks';

const Kosten = () => {
  const years = 25;
  var costPowerStorage = useAppSelector((state) => state.powerStorageData.costPowerStorage);
  var sizePowerStorage = useAppSelector((state) => state.powerStorageData.sizePowerStorage);
  var modulePower = useAppSelector((state) => state.pvModuleData.modulePower);
  var costPVModule = useAppSelector((state) => state.pvModuleData.costPVModule);
  var panelNo = useAppSelector((state) => state.objectData.panelNo);
  var currPurchaseMonth = useAppSelector((state) => state.currentProfilData.currPurchaseMonth);
  var powerCosts = useAppSelector((state) => state.currentProfilData.powerCosts);
  let currFeedMonth = useAppSelector((state) => state.currentProfilData.currFeedMonth);

  var pvPower = (modulePower * panelNo) / 1000;
  var currFeedYear = currFeedMonth?.reduce((acc, val) => acc + val);
  currFeedYear = Math.round(currFeedYear);
  var currPurchaseYear = currPurchaseMonth?.reduce((acc, val) => acc + val);
  currPurchaseYear = Math.round(currPurchaseYear);
  var costBatt = costPowerStorage * sizePowerStorage;
  var costPV = pvPower * costPVModule;
  var costPurchase = Math.round(((currPurchaseYear * powerCosts) / 100) * years);
  var sellPrice;
  pvPower <= 10 ? (sellPrice = 8.2) : (sellPrice = (10 * 8.2 + (pvPower - 10) * 7.1) / pvPower);
  sellPrice = Math.round(sellPrice * 10) / 10;
  //sellPrice = 20;
  var costFeed = Math.round(((currFeedYear * sellPrice) / 100) * years);

  return (
    <CostTable>
      <table>
        <tr>
          <th></th>
          <th>Strom/a</th>
          <th>Kosten/a</th>
          <th>Kosten/{years}a</th>
        </tr>
        <tr>
          <td>Stromkauf</td>
          <td>{currPurchaseYear} kWh/a</td>
          <td>{(currPurchaseYear * powerCosts) / 100} €/a</td>
          <td>{costPurchase} €</td>
        </tr>
        <tr>
          <td>Stromverkauf ({sellPrice})</td>
          <td>{currFeedYear} kWh/a</td>
          <td>{(currFeedYear * sellPrice) / 100} €/a</td>
          <td>- {costFeed} €</td>
        </tr>
        <tr>
          <td>PV Kauf</td>
          <td></td>
          <td></td>
          <td>{costPV} €</td>
        </tr>
        <tr>
          <td>Batterie Kauf</td>
          <td></td>
          <td></td>
          <td>{costBatt} €</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Summe:</td>
          <td>{costPV + costBatt + costPurchase - costFeed} €</td>
        </tr>
      </table>
    </CostTable>
  );
};

export { Kosten };

const CostTable = styled.div`
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
`;
