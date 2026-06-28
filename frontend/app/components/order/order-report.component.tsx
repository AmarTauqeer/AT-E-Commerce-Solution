import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "flex",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 5,
  },
  header: {
    fontWeight: "bold",
    flexDirection: "row",
    marginTop: 5,
    borderBottom: 1,
    paddingBottom: 3,
    backgroundColor: "black",
    color: "white",
    paddingVertical: "3px"

  },
  id: {
    width: "5%",
    fontSize:"8",
  },
  name: {
    width: "35%",
    fontSize:"8",
  },
  // description: {
  //   width: "45%",
  //   fontSize:"8",
  // },
  category: {
    width: "10%",
    fontSize:"8",
    paddingLeft:"2px",
    textAlign:"right"
  },
  price: {
    width: "20%",
    fontSize:"8",
    textAlign:"right",
    paddingRight:"5px"
  },
  createdAt: {
    width: "30%",
    fontSize:"8",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#999',
  },
  date: {
    fontSize: 8,
    textAlign:'right',
    marginBottom:'2px'
  },
   grandTotal: {
        marginTop: 20,
        fontSize: 12,
        textAlign: "right",
        fontWeight: "bold",
    }
});

export function OrderReport(props:any)

{
    const generatedAt = new Date().toLocaleString();
    const orderStatus = props.order.order_status
    const email = props.order.email
    console.log(props.products)

     const grandTotal = props.products.reduce(
    (total:any, item:any) =>
      total + parseInt(item.quantity) * parseInt(item.price),
    0
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Order Report
        </Text>
        <Text style={styles.date}>
          Customer:{email!==undefined && email}
        </Text>
        <Text style={styles.date}>
          Status:{orderStatus!==undefined && orderStatus}
        </Text>

         <Text style={styles.date}>
            Generated: {generatedAt}
          </Text>

        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.id}>ID</Text>
            <Text style={styles.name}>Name</Text>
            <Text style={styles.category}>Category</Text>
            <Text style={styles.price}>Quantity</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.price}>Amount</Text>
          </View>

          {props.products.map((product:any,index:any) => (
            <View
              key={index}
              style={styles.row}
            >
              <Text style={styles.id}>
                {product.id}
              </Text>

              <Text style={styles.name}>
                {product.product_name}
              </Text>

              <Text style={styles.category}>
                {product.category_name}
              </Text>
               <Text style={styles.price}>
                {product.quantity}
              </Text>

              <Text style={styles.price}>
                {product.price.toFixed(2)}
              </Text>
              <Text style={styles.price}>
                {product.amount_per_product.toFixed(2)}
              </Text>

            </View>
          ))}
        </View>
        <View >
          <Text style={styles.grandTotal} >
            Grand Total: €{grandTotal.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      </Page>
    </Document>
  );
}