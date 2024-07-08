import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useQuery } from "@tanstack/react-query";
import { AssignmentWithPayload, ExtendedAssignment } from "@/types";
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
    textAlign: "center",
    // width:"100%",
    position: "absolute",
    bottom: "37.9%",
    left: "16%",
  },
  issueDate: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: "semibold",
    position: "absolute",
    bottom: "6.5%",
    right: "19%",
  },
});

const backStyle = StyleSheet.create({
  headerText: {
    fontSize: "16px",
    fontWeight: "semibold",
    textAlign: "center",
    padding: "16px",
  },
  table: {
    marginLeft: "32px",
    marginRight: "32px",
  },
  tableCell: {
    padding: "2px",
    fontSize: "12px",
  },
  bottomSignature: {
    bottom: "5%",
    position: "absolute",
    right: "5%",
  },
  userSignature: {
    bottom: "5%",
    position: "absolute",
    left: "5%",
  },
});

const PdfComponent = ({
  name,
  clubName,
  assignments,
  mentorName,
  date,
  mentorSign,
}: {
  name: string;
  clubName: string;
  assignments: ExtendedAssignment[];
  mentorName: string;
  date: string;
  mentorSign: string;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image src={"/assets/certificate.png"} style={styles.img} />
        <Text style={styles.name}>{name}</Text>
        {/* <Text style={styles.field}>Tit tit</Text> */}
        <Text style={styles.date}>
          For participating and completing the extracurricular activity of{" "}
          {clubName}
        </Text>
        {/* <Text style={styles.issueDate}></Text> */}
      </Page>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View>
          <Text style={backStyle.headerText}>Daftar nilai</Text>
        </View>
        <Table style={backStyle.table}>
          <TH>
            <TD style={{
                ...backStyle.tableCell,
                width:"20px"
              }}>
                <Text style={{
                  fontWeight:"semibold"
                }}>No</Text>
              </TD>
            <TD style={backStyle.tableCell}>Tugas</TD>
            <TD style={backStyle.tableCell}>Mark</TD>
          </TH>
          {assignments?.map((assignment, i) => (
            <TR key={assignment.id}>
              <TD style={backStyle.tableCell}>{i + 1}</TD>
              <TD style={backStyle.tableCell}>{assignment.name}</TD>
              <TD style={backStyle.tableCell}>
                {assignment.mark ? assignment.mark : "-"}
              </TD>
            </TR>
          ))}
        </Table>
        <View
          style={{
            display: "flex",
            position: "absolute",
            bottom: "5%",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={backStyle.bottomSignature}>
            <Text
              style={{
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Medan, {date}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              STMIK TIME Medan
            </Text>
            <Image
              src={mentorSign}
              style={{
                width: "80px",
                height: "70px",
                objectFit: "cover",
              }}
            />

            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {mentorName}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {clubName}'s Mentor
            </Text>
          </View>
          <View style={backStyle.userSignature}>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              Signature of holder
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfComponent;
