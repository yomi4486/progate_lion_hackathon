// ここに基本的なスタイルを保管
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	leftContainer: {
		flex: 4,
	},
	iconContainer: {
		paddingRight: 10,
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 21,
	},
})

export const localStyles = StyleSheet.create({
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EEEEEE', // 背景色を指定
		height: 40,
		borderRadius: 20,
		paddingHorizontal: 10,
		marginHorizontal: 20,
		marginTop: 30,
		marginBottom: 30,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
		color: '#A0A0A0',
	},
	// ...他のスタイルをここに追加...
	callHistoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#DDDDDD',
	},
	friendIconContainer: {
		position: 'relative',
		marginRight: 10,
	},
	onlineIndicator: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 15,
		height: 15,
		borderRadius: 10,
		backgroundColor: 'green',
	},
	callDetails: {
		flex: 1,
	},
	friendName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	missedCallContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
	},
	missedCallText: {
		marginLeft: 5,
		color: 'red',
	},
	callTime: {
		color: '#A0A0A0',
	},
	separator: {
		height: 2, // 下線の太さをさらに変更
		backgroundColor: '#DDDDDD',
		marginTop: 10,
	},
	callDuration: {
		// 追加: 通話時間のスタイル
		color: '#A0A0A0',
	},
})

export const profileStyles = StyleSheet.create({
	profileContainer: {
		alignItems: 'center',
		marginTop: 20,
	},
	profileIcon: {
		fontSize: 90,
		color: '#eeeeee', // アイコンの色を変更
	},
	profileName: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 10,
	},
	profileStatusContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
	},
	activeDot: {
		fontSize: 18,
		color: '#4CAF50',
		marginRight: 5,
	},
	profileStatus: {
		fontSize: 16,
		color: '#4CAF50',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 20,
		backgroundColor: '#e0f7e0',
		overflow: 'hidden',
	},
	statusInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		width: '80%',
		borderColor: '#cccccc',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 10,
	},
	blurStatusInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e0f7e0',
		marginTop: 10,
		width: '40%',
		borderColor: '#00000000',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 10,
		color: '#4CAF50',
	},
	statusInput: {
		flex: 1,
		textAlign: 'center',
		marginLeft: 10,
		height: 40,
	},
	blurStatusInput: {
		flex: 1,
		height: 30,
		color: '#4CAF50',
		textAlign: 'center',
		marginLeft: 10,
		fontWeight: 'bold',
	},
	statusEditIcon: {
		fontSize: 20,
		color: '#888',
		marginLeft: 10,
	},
	friendsContainer: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	friendsTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	friendsBox: {
		backgroundColor: '#f1f1f1',
		borderRadius: 20,
		padding: 10,
		marginHorizontal: 10,
	},
})