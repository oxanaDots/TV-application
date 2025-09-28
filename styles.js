import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainCont: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    flex: 0.5,
    gap: 10,
  },

  cont: {
    display: "flex",
    flex: 1,
    gap: 20,
    width: "80%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },

  connectButton: {
    display: "flex",

    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: "rgb(46, 16, 101)",
    borderRadius: 3,
  },

  buttonText: {
    color: "rgb(255, 247, 237)",
    fontWeight: "bold",
    fontSize: 20,
  },
  codeCont: {
    paddingHorizontal: 30,
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    borderWidth: 2,
    borderColor: "rgb(212, 212, 216)",
    borderRadius: 3,
    backgroundColor: "white",
  },

  codeText: {
    fontWeight: "600",
    fontSize: 30,
    color: "rgb(82, 82, 91)",
  },
  header: {
    fontSize: 17,
    fontWeight: 500,
    marginBottom: 30,
  },

  textInput: {
    backgroundColor: "rgb(244, 244, 245)",
    width: 30 * 6 - 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "rgb(212, 212, 216)",
    paddingVertical: 15,
    borderRadius: 3,
    fontSize: 30,
    color: "rgb( 82, 82, 91)",
  },
});

export default styles;

// 46, 16, 101 violet
// 212, 212, 216 zinc 300
// 82, 82, 91 zinc 600
