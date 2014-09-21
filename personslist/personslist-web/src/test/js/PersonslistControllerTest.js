describe("The personslist", function() {
	var personsListController;
	var personsListView;

	beforeEach(function() {
		personsListView = sap.ui.view({
			viewName : "personslist-web.personslist",
			type : sap.ui.core.mvc.ViewType.JS
		});
		personsListController = personsListView.getController();
	});

	it("controller and view should be initialized before a test", function() {
		expect(personsListView).not.toBe(undefined);
		expect(personsListController).not.toBe(undefined);
	});

	it("controller should show the view message area when a message is set", function() {
		expect(personsListView.getMsgViewHLayout().getVisible()).toBe(false);
		personsListController.showMsgArea("error", "this is some error message");
		expect(personsListView.getMsgViewHLayout().getVisible()).toBe(true);
	});

	it("should display a warning if you press 'delete' given an empty list", function() {
		personsListController.deleteSelectedPerson();
		expect(personsListView.getMsgField().getText()).toBe("Table is empty. Create a person table entry before you delete a person.");
	});

	it("should not display a warning if you press 'delete' given a non-empty list", function() {
		var jsonModel = new sap.ui.model.json.JSONModel();
		var oMockData = [ {
			FirstName : "Tester",
			LastName : "Name"
		}, {
			FirstName : "Tester2",
			LastName : "Name2"
		}, {
			FirstName : "Tester3",
			LastName : "Name3"
		} ];
		jsonModel.remove = jasmine.createSpy('remove');
		jsonModel.setData(oMockData);
		personsListView.setModel(jsonModel);

		var mockTable = jasmine.createSpyObj('mockTable', [ 'getSelectedIndex', 'getContextByIndex', 'clearSelection' ]);
		mockTable.getSelectedIndex.andReturn(1);
		mockTable.getContextByIndex.andCallFake(function() {
			return oMockData[arguments[0]];
		});
		personsListController.deleteSelectedPerson(mockTable);
		expect(personsListView.getMsgViewHLayout().getVisible()).toBe(false);
		expect(jsonModel.remove).toHaveBeenCalledWith('', oMockData[1], jasmine.any(Function), jasmine.any(Function));
	})
});