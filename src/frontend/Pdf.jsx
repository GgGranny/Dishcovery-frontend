import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        color: "black",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    viewer: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 20,
        padding: 10,
        backgroundColor: "gray"
    }
});

const Pdf = (props) => {
    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text>Eleven Coder Bill</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>{props.name}</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}
export default Pdf;
