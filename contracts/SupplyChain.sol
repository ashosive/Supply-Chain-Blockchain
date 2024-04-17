// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    address public Owner;

    constructor() public {
        Owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == Owner);
        _;
    }

    enum STAGE {
        Init,
        farmerSupplyStage,
        processing,
        Distribution,
        buyers,
        sold
    }

    uint256 public orderUnitCtr = 0;
    uint256 public frmctr = 0;
    uint256 public processingCtr = 0;
    uint256 public disCtr = 0;
    uint256 public buyerCtr = 0;

    struct unitOrder {
        uint256 id;
        string name;
        string description;
        uint256 farId;
        uint256 proId;
        uint256 DISid;
        uint256 BuyId;
        STAGE stage;
    }

    mapping(uint256 => unitOrder) public unitStock;

    function showStage(uint256 _unitID)
        public
        view
        returns (string memory)
    {
        require(orderUnitCtr > 0);
        if (unitStock[_unitID].stage == STAGE.Init)
            return "Unit Ordered";
        else if (unitStock[_unitID].stage == STAGE.farmerSupplyStage)
            return "Farmer  Supply Stage";
        else if (unitStock[_unitID].stage == STAGE.processing)
            return "Processing Stage";
        else if (unitStock[_unitID].stage == STAGE.Distribution)
            return "Distribution Stage";
        else if (unitStock[_unitID].stage == STAGE.buyers)
            return "Buyer Stage";
        else if (unitStock[_unitID].stage == STAGE.sold)
            return "Unit Sold";

        return "Unknown Stage";
    }

    struct farmerRawSupplier {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => farmerRawSupplier) public FARMER;

    struct processing {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => processing) public MAN;

    struct distributor {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => distributor) public DIS;

    struct buyer {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => buyer) public RET;

    function addFarmer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        frmctr++;
        FARMER[frmctr] = farmerRawSupplier(_address, frmctr, _name, _place);
    }

    function addProcessing(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        processCtr++;
        MAN[processCtr] = processing(_address, processCtr, _name, _place);
    }

    function addDistributor(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        disCtr++;
        DIS[disCtr] = distributor(_address, disCtr, _name, _place);
    }

    function addBuyer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        buyerCtr++;
        RET[buyerCtr] = buyer(_address, buyerCtr, _name, _place);
    }

    function FarmerSupply(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findFarmer()(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.Init);
        unitStock[_unitID].farId = _id;
        unitStock[_unitID].stage = STAGE.farmerSupplyStage;
    }

    function findFarmer(address _address) private view returns (uint256) {
        require(frmctr > 0);
        for (uint256 i = 1; i <= frmctr; i++) {
            if (FARMER[i].addr == _address) return FARMER[i].id;
        }
        return 0;
    }

    function Processing(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findProcessing(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.farmerSupplyStage);
        unitStock[_unitID].proId = _id;
        unitStock[_unitID].stage = STAGE.processing;
    }

    function findProcessing(address _address) private view returns (uint256) {
        require(processCtr > 0);
        for (uint256 i = 1; i <= processCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    function Distribute(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findDIS(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.processing);
        unitStock[_unitID].DISid = _id;
        unitStock[_unitID].stage = STAGE.Distribution;
    }

    function findDIS(address _address) private view returns (uint256) {
        require(disCtr > 0);
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    function Buyer(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findBuyer(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.Distribution);
        unitStock[_unitID].BuyId = _id;
        unitStock[_unitID].stage = STAGE.buyers;
    }

    function findBuyer(address _address) private view returns (uint256) {
        require(buyerCtr > 0);
        for (uint256 i = 1; i <= buyerCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }

    function sold(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findBuyer(msg.sender);
        require(_id > 0);
        require(_id == unitStock[_unitID].BuyId);
        require(unitStock[_unitID].stage == STAGE.buyers);
        unitStock[_unitID].stage = STAGE.sold;
    }

    function addUnit(string memory _name, string memory _description)
        public
        onlyByOwner()
    {
        require((frmctr > 0) && (processCtr > 0) && (disCtr > 0) && (buyerCtr > 0));
        orderUnitCtr++;
        unitStock[orderUnitCtr] = medicine(
            orderUnitCtr,
            _name,
            _description,
            0,
            0,
            0,
            0,
            STAGE.Init
        );
    }
}
