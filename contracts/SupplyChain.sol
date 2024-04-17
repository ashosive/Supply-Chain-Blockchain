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

    //stages of a medicine in pharma supply chain
    enum STAGE {
        Init,
        farmerSupplyStage,
        processing,
        Distribution,
        buyers,
        sold
    }
    //using this we are going to track every single medicine the owner orders

    //Medicine count
    uint256 public orderUnitCtr = 0;
    //Raw material supplier count
    uint256 public frmctr = 0;
    //Manufacturer count
    uint256 public processingCtr = 0;
    //distributor count
    uint256 public disCtr = 0;
    //retailer count
    uint256 public buyerCtr = 0;

    //To store information about the medicine
    struct unitOrder {
        uint256 id; //unique medicine id
        string name; //name of the medicine
        string description; //about medicine
        uint256 farId; //id of the Raw Material supplier for this particular medicine
        uint256 proId; //id of the Manufacturer for this particular medicine
        uint256 DISid; //id of the distributor for this particular medicine
        uint256 BuyId; //id of the retailer for this particular medicine
        STAGE stage; //current medicine stage
    }

    //To store all the medicines on the blockchain
    mapping(uint256 => unitOrder) public unitStock;

    //To show status to client applications
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

    //To store information about raw material supplier
    struct farmerRawSupplier {
        address addr;
        uint256 id; //supplier id
        string name; //Name of the raw material supplier
        string place; //Place the raw material supplier is based in
    }

    //To store all the raw material suppliers on the blockchain
    mapping(uint256 => farmerRawSupplier) public FARMER;

    //To store information about manufacturer
    struct processing {
        address addr;
        uint256 id; //manufacturer id
        string name; //Name of the manufacturer
        string place; //Place the manufacturer is based in
    }

    //To store all the manufacturers on the blockchain
    mapping(uint256 => processing) public MAN;

    //To store information about distributor
    struct distributor {
        address addr;
        uint256 id; //distributor id
        string name; //Name of the distributor
        string place; //Place the distributor is based in
    }

    //To store all the distributors on the blockchain
    mapping(uint256 => distributor) public DIS;

    //To store information about retailer
    struct buyer {
        address addr;
        uint256 id; //retailer id
        string name; //Name of the retailer
        string place; //Place the retailer is based in
    }

    //To store all the retailers on the blockchain
    mapping(uint256 => buyer) public RET;

    //To add raw material suppliers. Only contract owner can add a new raw material supplier
    function addFarmer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        frmctr++;
        FARMER[frmctr] = farmerRawSupplier(_address, frmctr, _name, _place);
    }

    //To add manufacturer. Only contract owner can add a new manufacturer
    function addProcessing(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        processCtr++;
        MAN[processCtr] = processing(_address, processCtr, _name, _place);
    }

    //To add distributor. Only contract owner can add a new distributor
    function addDistributor(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        disCtr++;
        DIS[disCtr] = distributor(_address, disCtr, _name, _place);
    }

    //To add retailer. Only contract owner can add a new retailer
    function addBuyer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        buyerCtr++;
        RET[buyerCtr] = buyer(_address, buyerCtr, _name, _place);
    }

    //To supply raw materials from RMS supplier to the manufacturer
    function FarmerSupply(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findFarmer()(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.Init);
        unitStock[_unitID].farId = _id;
        unitStock[_unitID].stage = STAGE.farmerSupplyStage;
    }

    //To check if RMS is available in the blockchain
    function findFarmer(address _address) private view returns (uint256) {
        require(frmctr > 0);
        for (uint256 i = 1; i <= frmctr; i++) {
            if (FARMER[i].addr == _address) return FARMER[i].id;
        }
        return 0;
    }

    //To manufacture medicine
    function Processing(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findProcessing(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.farmerSupplyStage);
        unitStock[_unitID].proId = _id;
        unitStock[_unitID].stage = STAGE.processing;
    }

    //To check if Manufacturer is available in the blockchain
    function findProcessing(address _address) private view returns (uint256) {
        require(processCtr > 0);
        for (uint256 i = 1; i <= processCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    //To supply medicines from Manufacturer to distributor
    function Distribute(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findDIS(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.processing);
        unitStock[_unitID].DISid = _id;
        unitStock[_unitID].stage = STAGE.Distribution;
    }

    //To check if distributor is available in the blockchain
    function findDIS(address _address) private view returns (uint256) {
        require(disCtr > 0);
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    //To supply medicines from distributor to retailer
    function Buyer(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findBuyer(msg.sender);
        require(_id > 0);
        require(unitStock[_unitID].stage == STAGE.Distribution);
        unitStock[_unitID].BuyId = _id;
        unitStock[_unitID].stage = STAGE.buyers;
    }

    //To check if retailer is available in the blockchain
    function findBuyer(address _address) private view returns (uint256) {
        require(buyerCtr > 0);
        for (uint256 i = 1; i <= buyerCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }

    //To sell medicines from retailer to consumer
    function sold(uint256 _unitID) public {
        require(_unitID > 0 && _unitID <= orderUnitCtr);
        uint256 _id = findBuyer(msg.sender);
        require(_id > 0);
        require(_id == unitStock[_unitID].BuyId); //Only correct retailer can mark medicine as sold
        require(unitStock[_unitID].stage == STAGE.buyers);
        unitStock[_unitID].stage = STAGE.sold;
    }

    // To add new medicines to the stock
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
