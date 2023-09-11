package com.example.contract;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.4.2.
 */
@SuppressWarnings("rawtypes")
public class SmartContractABI extends Contract {
    public static final String BINARY = "Bin file was not provided";

    public static final String FUNC_DIDDOCUMENTS = "didDocuments";

    public static final String FUNC_GETDID = "getDID";

    public static final String FUNC_GETVCHASH = "getVcHash";

    public static final String FUNC_SETDID = "setDID";

    public static final String FUNC_SETVCHASH = "setVcHash";

    @Deprecated
    protected SmartContractABI(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected SmartContractABI(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected SmartContractABI(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected SmartContractABI(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<String> didDocuments(String param0) {
        final Function function = new Function(FUNC_DIDDOCUMENTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> getDID(String did) {
        final Function function = new Function(FUNC_GETDID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(did)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> getVcHash(String did) {
        final Function function = new Function(FUNC_GETVCHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(did)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> setDID(String did, String didDocument) {
        final Function function = new Function(
                FUNC_SETDID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(did), 
                new org.web3j.abi.datatypes.Utf8String(didDocument)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setVcHash(String did, String vcHash) {
        final Function function = new Function(
                FUNC_SETVCHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(did), 
                new org.web3j.abi.datatypes.Utf8String(vcHash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static SmartContractABI load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new SmartContractABI(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static SmartContractABI load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new SmartContractABI(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static SmartContractABI load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new SmartContractABI(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static SmartContractABI load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new SmartContractABI(contractAddress, web3j, transactionManager, contractGasProvider);
    }
}
