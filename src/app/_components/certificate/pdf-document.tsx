import React from 'react'
import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
} from "@react-pdf/renderer"

 
// If loading a variable font, you don't need to specify the font weight
// const montserrat = Montserrat({
// 	subsets:['latin']
// })

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
		color: "#1b1b1b",
		fontSize: "14px",
		// fontWeight: "bold",
		textAlign:"center",
		// width:"100%",
		position: "absolute",
		bottom: "37.9%",
		left:'16%',
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

const PdfComponent = ({ name,clubName}:{name:string,clubName:string}) => {


	return (
		<Document>
			<Page size="A4" style={styles.page} orientation="landscape">
				<Image src={'/assets/certificate.png'} style={styles.img} />
				<Text style={styles.name}>{name}</Text>
				{/* <Text style={styles.field}>Tit tit</Text> */}
				<Text style={styles.date}>For participating and completing the extracurricular activity of {clubName}</Text>
				{/* <Text style={styles.issueDate}></Text> */}
			</Page>
		</Document>
	)
}

export default PdfComponent