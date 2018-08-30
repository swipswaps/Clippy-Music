var DlList = {
	$dlQueueContainer: $('#dl-list-container'),

	contentToDlItemElem: function contentToDlItemElem(content) {
		var $dlItem = templates.makeDlItem();

		$dlItem.find('.title').html(content.title);
		$dlItem.attr('data-cid', content.cid);
		if (content.percent) fillDlBar($dlItem.find('.dl-bar'), content.percent);
		if (content.error) $dlItem.addClass('error');

		return $dlItem;
	},

	fillDlBar: function fillDlBar($bar, percent) {
		var fullWidth = 444; //based on css; can't evaluate at run time due to width being unknown if $bar is not in DOM
		var blockWidth = 10; //based on css; they're all the same width
		var blockPercent = blockWidth / fullWidth;
		var blocksAlready = $bar.find('.dl-block').length;
		
		var targetBlockCount = Math.ceil(percent / blockPercent);

		for (var i = blocksAlready; i < targetBlockCount; i++) {
			$bar.append(templates.makeDlBlock());
		}
	},

	findDlItemElem: function findDlItemElem() {
		this.$dlQueueContainer.find('[data-cid=' + contentId + ']');
	},

	renderDlList: function renderDlList(list) {
		if (list.length === 0) {
			this.$dlQueueContainer.addClass('hidden');
			return;
		} else {
			this.$dlQueueContainer.removeClass('hidden');
		}

		var $dlQueue = this.$dlQueueContainer.find('.bucket');

		//replace old list from DOM
		$dlQueue.empty();

		//put items in the dlQueue
		for (let i = 0; i < list.length; i++) {
			$dlQueue.append(contentToDlItemElem(list[i]));
		}
	},

	showError: function showError(contentId) {
		findDlItemElem(contentId).addClass('error');
	}
}