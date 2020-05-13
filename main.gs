function myFunction() {
	newMessages = searchMailFromNurserySchool()
	if (newMessages.length > 0) {
		sendLine(newMessages)
	}
}

// 保育園からのメールのスレッドを取得する
function searchMailFromNurserySchool() {
	// "is unread"は未読のフィルター
	const query = `is:unread from:"sapporoyume-ns@s2.ktaiwork.jp"`
	// const query = `from:"sapporoyume-ns@s2.ktaiwork.jp"`
	// const query = `label:"さっぽろゆめ保育園"`
	const start = 0
	const max = 10

	const threads = GmailApp.search(query, start, max)
	const messagesForThreads = GmailApp.getMessagesForThreads(threads)

	if (messagesForThreads.length > 0) {
		const lastIndex = messagesForThreads.length - 1
		const lastThread = messagesForThreads[lastIndex][0]

		const message = `
    【date】: ${lastThread.getDate()}
    【From】:${lastThread.getFrom()}
    【Subject】:${lastThread.getSubject()}
    【Body】:${lastThread.getPlainBody()}
    `

		lastThread.markRead() //メールを既読にする

		return message
	}
	return false
}

function sendLine(message) {
	// トークン名:"保育園からのメールをLINEに通知"
	// const LINE_NOTIFY_ACCESS_TOKEN = 'B0EZ6VH6YtjLTfhKVGaQO7Ff3tKExKO8LlcIuVhQWHv'
	const LINE_NOTIFY_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_NOTIFY_ACCESS_TOKEN')

	const payload = { message }
	const options = {
		method: 'POST',
		payload: payload,
		headers: { Authorization: `Bearer ${LINE_NOTIFY_ACCESS_TOKEN}` },
	}
	UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options)
}
