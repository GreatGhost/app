const AddrOutputKey = 'Component.Addr.Write'
const AddrHistoryKey = 'Component.Addr.History'
const AddrDockHistoryKey = 'Component.Addr.Dock.History'

const SearchHistoryGoods = 'history.search.journey.goods'
const SearchHistoryShip = 'history.search.journey.ship'

const UserInfoKey = 'user.current.info'

const GoodsTypeSelectorOutputKey = 'goods.typeSelector.output'
const GoodsTypeSearchHistory = 'goods.search.history'

const GoodsOwnerDetailInputKey = 'goods.owner.detail.input'

const FeeDetailIntputKey = "goods.add.feeDetail.input"
const FeeDetailOutputKey = "goods.add.feeDetail.output"

const ShipListInputKey = 'goods.ship.list.input'
const GoodsListInputKey = 'ship.goods.list.input'

const AuthNextInputKey = 'auth.next.input'


const DeviceInfo = 'device.info'

const orderId='orderId'
/* 下面常量是联系人以及船舶常量 */
const OrderAddContactOutputKey ='order.add.contact.output'

const ContactEdit='contact.edit'
const shipEdit='ship.edit'
const ShipListSelectorOutputKey='ship.list.selector.selected'

module.exports = {
  UserInfoKey: UserInfoKey,
  orderId:orderId,
  AddrOutputKey: AddrOutputKey,
  AddrHistoryKey: AddrHistoryKey,
  AddrDockHistoryKey: AddrDockHistoryKey,
  
  SearchHistoryGoods: SearchHistoryGoods,
  SearchHistoryShip: SearchHistoryShip,

  GoodsTypeSearchHistory: GoodsTypeSearchHistory,
  GoodsTypeSelectorOutputKey: GoodsTypeSelectorOutputKey,  
  FeeDetailOutputKey:FeeDetailOutputKey,
  FeeDetailIntputKey:FeeDetailIntputKey,
  GoodsOwnerDetailInputKey:GoodsOwnerDetailInputKey,

  ShipListInputKey:ShipListInputKey,
  GoodsListInputKey:GoodsListInputKey,

  AuthNextInputKey:AuthNextInputKey,

  DeviceInfo: DeviceInfo,

  OrderAddContactOutputKey:OrderAddContactOutputKey,
  ContactEdit:ContactEdit,
  shipEdit:shipEdit,
  ShipListSelectorOutputKey:ShipListSelectorOutputKey
}