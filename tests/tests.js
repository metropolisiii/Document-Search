describe('Category Tests', function(){
	beforeEach(module('searchApp'));
	it('should have a searchCtrls controller', function(){
		expect(searchApp.searchCtrl).toBeDefined();
	});
});