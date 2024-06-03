import React from 'react'
import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
} from "@react-pdf/renderer"
const styles = StyleSheet.create({
	page: {
		backgroundColor: "#ffffff",
		position: "relative",
	},
	img: {
		objectFit: "cover",
		height: "99%",
	},
	name: {
		width: "100%",
		color: "#000000",
		fontSize: "26px",
		fontWeight: "bold",
		position: "absolute",
        top: "50%",
		right: "0%",
		transform: "translateY(-50%)",
		textTransform: "uppercase",
		textAlign: "center",
		// fontFamily: "Lora",
	},
	field: {
		width: "100%",
		color: "#000000",
		fontSize: "17px",
		fontWeight: "bold",
		position: "absolute",
		top: "53%",
		right: "0%",
		transform: "translateY(-50%)",
		textTransform: "uppercase",
		textAlign: "center",
	},
	date: {
		color: "#000000",
		fontSize: "16px",
		fontWeight: "bold",
		position: "absolute",
		top: "49%",
		right: "16.5%",
	},
	issueDate: {
		color: "#000000",
		fontSize: "14px",
		fontWeight: "semibold",
		position: "absolute",
		bottom: "6.5%",
		right: "19%",
	},
})

const PdfDocument = () => {


	return (
		<Document>
			<Page size="A4" style={styles.page} orientation="landscape">
				<Image src={'/assets/certificate.png'} style={styles.img} />
				<Text style={styles.name}>Andrian Lysander</Text>
				<Text style={styles.field}>Tit tit</Text>
				<Text style={styles.date}>fkoff</Text>
				{/* <Text style={styles.issueDate}></Text> */}
			</Page>
		</Document>
	)
}

export default PdfDocument